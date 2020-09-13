import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import path from "path";
import { Worker } from "worker_threads";
import { checkThirdPartyPlatformToken } from '../guard';
import { IQuestionService } from '../models/Interface/IQuestionService';
import { getAsync, setAsync } from '../redisClient';
import { UserService } from '../services/UserService';
import { youtubeExchangeForAccessToken, createQuestion } from './utils';
const youtubeWorkerPath = path.join(__dirname, "worker.js")

export class YoutubeRouter {
    constructor(private questionService: IQuestionService, private io: SocketIO.Server, private userService: UserService) { }

    router() {
        const router = express.Router()

        router.post('/token', this.fetchYTAccessAndRefreshToken)
        router.get('/comments/:meetingId([0-9]+)', checkThirdPartyPlatformToken(this.userService, 'youtube'), this.checkYTLiveBroadcast)
        router.put('/comments/:meetingId([0-9]+)', this.stopGettingYoutubeComments)
        return router

    }

    fetchYTAccessAndRefreshToken = async (req: Request, res: Response) => {
        try {
            const bodyString = 'code=' + req.body.accessCode + '&client_id=' + process.env.GOOGLE_CLIENT_ID + '&client_secret=' + process.env.GOOGLE_CLIENT_SECRET + '&redirect_uri=' + process.env.YOUTUBE_REDIRECT_URL + '&grant_type=authorization_code';
            const fetchRes = await fetch('https://accounts.google.com/o/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: bodyString,
            })
            const result = await fetchRes.json();
            if (result.error) throw new Error(result['error_description']);
            const isSaved = await this.userService.saveYoutubeRefreshTokenByUserId(req.personInfo?.userId!, result['refresh_token']);
            if (!isSaved) res.status(500).json({ status: false, message: '[Internal Error] Database Error' })
            res.status(200).json({ status: true, message: 'Successfully Exchange Access and Refresh Token!' });
            return;
        } catch (e) {
            console.log(e)
            res.status(400).json({ status: false, message: 'You may need to remove our app on your google account and try again' })
            return;
        }

    }
    checkYTLiveBroadcast = async (req: Request, res: Response) => {
        if (!req.youtubeRefreshToken) return res.status(403).json({ status: false, message: 'Check live broadcast - No Refresh Token!' });
        if (!req.personInfo?.userId) return res.status(401).json({ status: false, message: 'Check live broadcast - You have to log in first!', platform: true });
        const hostId = await this.questionService.getRoomHostByMeetingId(parseInt(req.params.meetingId));
        if (req.personInfo.userId !== hostId) return res.status(403).json({ status: false, message: 'You are not allowed to enable the youtube live comments in this meeting!', platform: true });
        try {
            //check instance
            const isExist = await getAsync(`EVENTSOURCE_${req.params.meetingId}_YOUTUBE`).then((data: any) => data)
            if (isExist === "true") {
                console.log('[Instance Duplicate] Stop starting new instance for fetching youtube comments');
                res.status(400).json({ status: false, message: 'Duplicate action!' });
                return;
            }
            if (isExist === "false") {
                console.log('[Youtube] turn event Existence to true!')
                await setAsync(`EVENTSOURCE_${req.params.meetingId}_YOUTUBE`, "true")
                res.status(200).json({ status: true, message: 'Continue fetching comments from Youtube' });
                return;
            }
            //get access token check refresh token, may put this in guard
            const resultFromYT = await youtubeExchangeForAccessToken(req.youtubeRefreshToken);
            if (!resultFromYT['access_token']) return res.status(403).json({ status: false, message: 'Expired/Invalid Refresh token, please grant permission to us again.' });
            const accessToken = encodeURIComponent(resultFromYT['access_token']);
            //find live broadcast
            const fetchRes = await fetch(`https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=active&broadcastType=all&key=${process.env.YOUTUBE_API_KEY}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await fetchRes.json();
            if (result.error) return res.status(400).json({ status: false, message: result.error.message });
            if (result.pageInfo.totalResults !== 1) return res.status(404).json({ status: false, message: 'No LiveBroadCast on Youtube!' });
            const liveChatId = result.items[0].snippet.liveChatId;
            const videoId = result.items[0].id;
            /* fetch comments from youtube  */
            // console.log('[LiveRouter] create new instance for youtube comments');
            /* Worker here */
            const youtubeWorker = new Worker(youtubeWorkerPath, { workerData: { videoId, userId: req.personInfo.userId, liveChatId, meetingId: parseInt(req.params.meetingId), accessToken, refreshToken: req.youtubeRefreshToken, io: "1", questionService: "2" } });
            youtubeWorker.on('exit', code => {
                console.log(`Youtube worker ends with code ${code}`)
                if (code !== 0) console.error("Error on fetching youtube comments!")
            })
            youtubeWorker.on('message', async (message) => {
                const { type } = message
                if (type === "youtube-stop") {
                    return this.io.in('host:' + req.personInfo!.userId).emit('youtube-stop', 'stop youtube live comments');
                }
                if (type === "CREATE_QUESTION") {
                    await createQuestion(message.value, this.io, this.questionService);
                    return
                }
                if (type === "youtube--views-stop") {
                    this.io.in('host:' + req.personInfo!.userId).emit('youtube-views-stop', 'Fail to get views count on Youtube!');
                    return;
                }
                if (type === "youtube-views-update") {
                    this.io.in('host:' + req.personInfo!.userId).emit('youtube-views-update', message.value);
                    return;
                }
                return
            })
            return res.status(200).json({ status: true, message: 'Start to fetch comments from Youtube' });
        } catch (error) {
            console.error(error)
            res.status(500).json({ status: false, message: error.message });
            return;
        }
    }
    stopGettingYoutubeComments = async (req: Request, res: Response) => {
        try {
            const meetingId = req.params.meetingId;
            const youtubeExistence = await getAsync(`EVENTSOURCE_${meetingId}_YOUTUBE`).then((data: any) => data)
            if (youtubeExistence !== "true") return res.status(400).json({ status: false, message: 'Timer not found, make sure the meetingId is correct!' });
            if (youtubeExistence === "true") await setAsync(`EVENTSOURCE_${meetingId}_YOUTUBE`, "false")
            return res.status(200).json({ status: true, message: 'Successfully stop fetching comments from youtube' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
            return;
        }
    }
}