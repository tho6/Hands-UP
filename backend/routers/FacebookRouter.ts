import express, { Request, Response } from 'express'
import fetch from 'node-fetch'
import EventSource from 'eventsource'
import { checkThirdPartyPlatformToken } from '../guard';
import { IQuestionService } from '../models/Interface/IQuestionService';
import { UserService } from '../services/UserService';
import { getAsync, setAsync, delAsync, getHallAsync, setHmAsync } from "../redisClient"
import { createQuestion, QuestionData } from './utils';

export class FacebookRouter {
    constructor(private questionService: IQuestionService, private io: SocketIO.Server, private userService: UserService) { }

    router() {
        const router = express.Router()
        router.post('/token', this.fetchAccessCode)
        router.post('/comments', checkThirdPartyPlatformToken(this.userService, 'facebook'), this.fetchComments)
        router.post('/views', checkThirdPartyPlatformToken(this.userService, 'facebook'), this.fetchViews)
        router.put('/comments/:meetingId([0-9]+)', this.stopGettingFacebookComments)
        router.put('/comments/:meetingId([0-9]+)/on', this.startGettingFacebookComments)
        return router

    }


    fetchAccessCode = async (req: Request, res: Response) => {
        try {
            if (!req.body.authCode) return res.status(401).json({ success: false, message: 'No authorization Code' })
            const authCode = req.body.authCode
            //take profile is ok since it includes sub (unique id) NO NEED OpenId
            const fetchRes = await fetch(`https://graph.facebook.com/v7.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URL}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${authCode}`)
            const result = await fetchRes.json()
            if (!result.access_token) return res.status(401).json({ success: false, message: "Invalid Auth Code" })
            const fetchResLongLivedToken = await fetch(`https://graph.facebook.com/v7.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&fb_exchange_token=${result.access_token}`)
            const resultLongLivedToken = await fetchResLongLivedToken.json()
            if (!resultLongLivedToken) return res.status(401).json({ success: false, message: "Exchange Long Lived User Code Error" })
            if (!req.personInfo?.userId) return res.status(401).json({ success: false, message: "No UserID" })
            await this.userService.saveFacebookTokenByUserId(req.personInfo?.userId, resultLongLivedToken.access_token)
            return res.status(200).json({ success: true, message: "Get Access Code Successful" })
        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }


    }

    fetchComments = async (req: Request, res: Response) => {
        try {

            if (!req.personInfo?.userId) return res.status(400).json({ success: false, message: "No UserID" })
            const accessToken = req.facebookToken
            // const accessToken = 'EAAg3wXWlMIMBAKT6ZAcK9G2XnzHjeRHb8ZAg7htaUQA4D8kV9rZCom0D2WodSCZBNupn0uQu5RzirdJHxk1oMqbN6XhmhBk5ZAdqzcxdhS6bF1jlqkhlTUWE8GZCYZAPEfKu98j20CUDYq5ZBNjDuYYje53o8yl39Uki6JmEkURnKSzVAbGRYaim'
            const liveLoc = req.body.liveLoc
            let liveVideoId: number
            let result
            if (!liveLoc) return res.status(400).json({ success: false, message: 'Please input liveLoc variable in req.body (user/page)' })
            if (liveLoc === 'user') {
                const fetchRes = await fetch(`https://graph.facebook.com/v7.0/me/live_videos?access_token=${accessToken}`)
                result = await fetchRes.json()

            } else if (liveLoc === 'page') {
                if (!req.body.pageId) return res.status(400).json({ success: false, message: 'Please input pageId variable in req.body' })
                const pageId = req.body.pageId
                const fetchRes = await fetch(`https://graph.facebook.com/v7.0/${pageId}/live_videos?access_token=${accessToken}`)
                result = await fetchRes.json()
            }
            if (result['error']) return res.status(401).json({ success: false, message: 'Bad Request to FB' })
            const liveVideos = result.data.filter((video: { "status": string }) => video.status === "LIVE")
            if (liveVideos.length > 1) {
                return res.status(400).json({ success: false, message: "More than one live is on facebook" })
            } else if (liveVideos.length === 0) {
                return res.status(400).json({ success: false, message: "No live is on facebook" })
            }
            liveVideoId = liveVideos[0].id
            // if (this.eventSourceExistence[`${req.body.meetingId}`]?.facebook === false) {
            //     this.eventSourceExistence[`${req.body.meetingId}`].facebook = true;
            //     return res.status(200).json({ success: true, message: "Connected to Facebook Comments Successfully" })
            // }
            const isExist = await getAsync(`EVENTSOURCE_${req.params.meetingId}_FACEBOOK`).then((data: any) => data);
            if (isExist === "true") {
                console.log('[Instance Duplicate] Stop starting new instance for fetching facebook comments');
                res.status(400).json({ status: false, message: 'Duplicate action!' });
                return;
            }
            if (isExist === "false") {
                console.log('[Facebook] turn event Existence to true!')
                await setAsync(`EVENTSOURCE_${req.params.meetingId}_FACEBOOK`, "true");
                res.status(200).json({ status: true, message: 'Continue fetching comments from Facebook' });
                return;
            }
            const fetchCommentsRes = new EventSource(`https://streaming-graph.facebook.com/${liveVideoId}/live_comments?access_token=${accessToken}&fields=created_time,from{name},message`, { withCredentials: true })
            fetchCommentsRes.onmessage = async (event) => {
                if (isExist === "false") return;
                const eventObj = JSON.parse(event.data);
                const questionData: QuestionData = { meetingId: req.body.meetingId, message: eventObj.message.trim(), platformId: 2, name: eventObj.from?.name || 'Anonymous' }
                createQuestion(questionData, this.io, this.questionService)
            }
            let viewsCounterFB = 0;
            const checkLiveStatus = setInterval(async () => {
                const fetchRes = await fetch(`https://graph.facebook.com/v7.0/${liveVideoId}?fields=status&access_token=${accessToken}`)
                const result = await fetchRes.json()
                if (!result.status) return;
                if (result.status.toLowerCase() !== 'live') {
                    fetchCommentsRes.close()
                    console.log('[Facebook] live closed')
                    this.clearTimeIntervalAndTimer(checkLiveStatus, req.body.meetingId)
                    this.io.in('host:' + req.personInfo?.userId).emit('facebook-stop', 'stop facebook live comments');
                    return;
                }
                viewsCounterFB += 1;
                if (viewsCounterFB === 4) {
                    this.fetchFBViews(req.personInfo?.userId!, req.body.meetingId, liveVideoId, accessToken);
                    viewsCounterFB = 0;
                }
            }, 5000)
            setAsync(`EVENTSOURCE_${req.params.meetingId}_FACEBOOK`, "true");
            return res.status(200).json({ success: true, message: "Connected to Facebook Comments Successfully" })
        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }

    fetchViews = async (req: Request, res: Response) => {
        try {
            if (!req.personInfo?.userId) return res.status(401).json({ success: false, message: "No UserID" })
            const accessToken = req.facebookToken
            // const accessToken = 'EAAg3wXWlMIMBAKT6ZAcK9G2XnzHjeRHb8ZAg7htaUQA4D8kV9rZCom0D2WodSCZBNupn0uQu5RzirdJHxk1oMqbN6XhmhBk5ZAdqzcxdhS6bF1jlqkhlTUWE8GZCYZAPEfKu98j20CUDYq5ZBNjDuYYje53o8yl39Uki6JmEkURnKSzVAbGRYaim'
            const liveVideoId = req.body.liveId
            const fetchViewRes = await fetch(`https://graph.facebook.com/v7.0/${liveVideoId}?fields=live_views&access_token=${accessToken}`)
            const liveViews = (await fetchViewRes.json()).live_views
            return res.status(200).json({ success: true, message: { liveViews } })
        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }
    fetchFBViews = async (userId: number, meetingId: number, liveVideoId: number, accessToken: string) => {
        try {
            const fetchViewRes = await fetch(`https://graph.facebook.com/v7.0/${liveVideoId}?fields=live_views&access_token=${accessToken}`)
            const liveViews = (await fetchViewRes.json()).live_views
            const viewsTimer = await getHallAsync(`VIEWS_TIMER_${meetingId}`).then((data: any) => data?.status ?? null)
            if (viewsTimer !== "true") return;
            await setHmAsync(`VIEWS_TIMER_${meetingId}`, "facebook", `${liveViews}`)
            this.io.in('host:' + userId).emit('facebook-views-update', liveViews);
            return;
        } catch (e) {
            console.error(e);
            return;
        }
    }

    stopGettingFacebookComments = async (req: Request, res: Response) => {
        try {
            const meetingId = req.params.meetingId;
            const isExist = await getAsync(`EVENTSOURCE_${req.params.meetingId}_FACEBOOK`).then((data: any) => data);
            if (isExist !== "true") return res.status(400).json({ status: false, message: 'Timer not found, make sure the meetingId is correct!' });
            if (isExist === "true") await setAsync(`EVENTSOURCE_${meetingId}_FACEBOOK`, "false")
            return res.status(200).json({ status: true, message: 'Successfully stop fetching comments from facebook' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
            return;
        }
    }
    startGettingFacebookComments = async (req: Request, res: Response) => {
        try {
            const meetingId = req.params.meetingId;
            const isExist = await getAsync(`EVENTSOURCE_${req.params.meetingId}_FACEBOOK`).then((data: any) => data);
            if (isExist !== "true") return res.status(400).json({ status: false, message: 'Timer not found, make sure the meetingId is correct!' });
            await setAsync(`EVENTSOURCE_${meetingId}_FACEBOOK`, "true")
            return res.status(200).json({ status: true, message: 'Successfully start fetching comments from facebook' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
            return;
        }
    }

    clearTimeIntervalAndTimer = (timer: NodeJS.Timeout, meetingId: number) => {
        clearInterval(timer);
        delAsync(`EVENTSOURCE_${meetingId}_FACEBOOK`)
    }
}