import express, { Request, Response } from 'express'
import fetch from 'node-fetch'
import EventSource from 'eventsource'
import { checkThirdPartyPlatformToken } from '../guard';
import { IQuestionService } from '../models/Interface/IQuestionService';
import { UserService } from '../services/UserService';


export class LiveRouter {
    private eventSourceExistence: { [id: string]: { facebook: boolean, youtube: boolean } } = {};
    constructor(private questionService: IQuestionService, private io: SocketIO.Server, private userService: UserService) { }

    router() {
        const router = express.Router()
        router.post('/fb/token', this.fetchAccessCode)
        router.post('/fb/comments', this.fetchComments)
        router.post('/fb/views', this.fetchViews)
        router.post('/yt/token', this.fetchYTAccessAndRefreshToken)
        router.get('/yt/comments/:meetingId([0-9]+)', checkThirdPartyPlatformToken(this.userService), this.checkYTLiveBroadcast)
        router.put('/yt/comments/:meetingId([0-9]+)', this.stopGettingYoutubeComments)
        router.post('/yt/views', this.fetchViews)
        router.get('/status/:meetingId', this.checkStatus)
        return router

    }


    fetchAccessCode = async (req: Request, res: Response) => {
        try {
            if (!req.body.authCode) return res.status(401).json({ success: false, message: 'No authorization Code' })
            const authCode = req.body.authCode
            console.log('getting FB AccessToken')
            //take profile is ok since it includes sub (unique id) NO NEED OpenId
            const fetchRes = await fetch(`https://graph.facebook.com/v7.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URL}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${authCode}`)
            const result = await fetchRes.json()
            if (!result.access_token) return res.status(401).json({ success: false, message: "Invalid Auth Code" })
            const fetchResLongLivedToken = await fetch(`https://graph.facebook.com/v7.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&fb_exchange_token=${result.access_token}`)
            const resultLongLivedToken = await fetchResLongLivedToken.json()
            if (!resultLongLivedToken) return res.status(401).json({ success: false, message: "Exchange Long Lived User Code Error" })
            console.log(resultLongLivedToken)
            //****save token */
            return res.status(200).json({ success: true, message: "Get Access Code Successful" })
        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }


    }
    // private checkLive = async (fetchCommentsRes: EventSource, liveVideoId: number, accessToken: string) => {
    //     const fetchRes = await fetch(`https://graph.facebook.com/v7.0/${liveVideoId}?fields=status&access_token=${accessToken}`)
    //     const result = await fetchRes.json()
    //     if (result.status.toLowerCase() !== 'live') {
    //         fetchCommentsRes.close()
    //         clearInterval()
    //     }
    // }
    fetchComments = async (req: Request, res: Response) => {
        try {
            //egt access token
            //whcih live?? user ? page?
            //***get token from database */
            const accessToken = 'EAAg3wXWlMIMBAKT6ZAcK9G2XnzHjeRHb8ZAg7htaUQA4D8kV9rZCom0D2WodSCZBNupn0uQu5RzirdJHxk1oMqbN6XhmhBk5ZAdqzcxdhS6bF1jlqkhlTUWE8GZCYZAPEfKu98j20CUDYq5ZBNjDuYYje53o8yl39Uki6JmEkURnKSzVAbGRYaim'
            const liveLoc = req.body.liveLoc
            // const liveLoc = 'user'
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
            const liveVideos = result.data.filter((video: any) => video.status === "LIVE")
            if (liveVideos.length > 1) {
                return res.status(400).json({ success: false, message: "More than one live is on facebook" })
            } else if (liveVideos.length === 0) {
                console.log('no live')
                return res.status(400).json({ success: false, message: "No live is on facebook" })
            }
            liveVideoId = liveVideos[0].id
            console.log('liveVideoId: ' + liveVideoId)
            const fetchCommentsRes = new EventSource(`https://streaming-graph.facebook.com/${liveVideoId}/live_comments?access_token=${accessToken}&fields=created_time,from{name},message`, { withCredentials: true })
            const regex = RegExp(/(不如)+|(.唔.)+|(點)+|(幾)+|(問)+|(多數)+|(how)+|(what)+|(when)+|(why)+|(where)+|(如果)+|(\?)+|^(can)+|(呢)$/, 'i');
            // const regex =  RegExp('(不如)+','g')
            fetchCommentsRes.onmessage = async (event) => {
                console.log(event.data)
                // console.log(event.data)
                const eventObj = JSON.parse(event.data);
                console.log(eventObj.message);
                console.log(regex.test(eventObj.message.trim()))
                console.log(eventObj.message.match(regex))
                if (!regex.test(eventObj.message)) return;

                const question = await this.questionService.createQuestionFromPlatform(req.body.meetingId, eventObj.message, 2, eventObj.from?.name || 'Anonymous');
                // console.log(question);
                this.io.in(`event:${question.meetingId}`).emit('create-question', question);
                //***io.emit here?

            }
            // this.eventSourceExistence[`${req.body.meetingId}`].facebook = true;
            const checkLiveStatus = setInterval(async () => {
                const fetchRes = await fetch(`https://graph.facebook.com/v7.0/${liveVideoId}?fields=status&access_token=${accessToken}`)
                const result = await fetchRes.json()
                console.log('check status')
                if (result.status.toLowerCase() !== 'live') {
                    fetchCommentsRes.close()
                    clearInterval(checkLiveStatus)
                    console.log('live closed')
                    console.log(fetchCommentsRes.readyState)
                }
            }, 5000)
            // const fetchCommentsRes = await fetch (`https://graph.facebook.com/v7.0/${liveVideoId}/comments?access_token=${accessToken}&fields=created_time,from{name},message`)
            // const comments = (await fetchCommentsRes.json()).data
            // console.log(comments)
            // return res.status(200).json({success:true, message:comments})
            //
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
            //egt access token
            //whcih live?? user ? page?
            //***get token from database */
            const accessToken = 'EAAg3wXWlMIMBAKT6ZAcK9G2XnzHjeRHb8ZAg7htaUQA4D8kV9rZCom0D2WodSCZBNupn0uQu5RzirdJHxk1oMqbN6XhmhBk5ZAdqzcxdhS6bF1jlqkhlTUWE8GZCYZAPEfKu98j20CUDYq5ZBNjDuYYje53o8yl39Uki6JmEkURnKSzVAbGRYaim'
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
    fetchYTAccessAndRefreshToken = async (req: Request, res: Response) => {
        try {
            const bodyString = 'code=' + req.body.accessCode + '&client_id=' + process.env.GOOGLE_CLIENT_ID + '&client_secret=' + process.env.GOOGLE_CLIENT_SECRET + '&redirect_uri=' + process.env.YOUTUBE_REDIRECT_URL + '&grant_type=authorization_code';
            console.log(bodyString);
            const fetchRes = await fetch('https://accounts.google.com/o/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: bodyString,
            })
            const result = await fetchRes.json();
            console.log(result);
            if (result.error) throw new Error(result['error_description']);
            const isSaved = await this.userService.saveYoutubeRefreshTokenByUserId(2, result['refresh_token']);
            if(!isSaved) res.status(500).json({status:false, message:'Internal Error, fail to save token to database!'})
            res.status(200).json({ status: true, message: 'Successfully Exchange Access and Refresh Token!' });
            console.log(result);
            return;
        } catch (e) {
            console.log(e)
            res.status(400).json({ status: false, message: 'Fail to Exchange Access and Refresh Token!' })
            return;
        }

    }
    checkYTLiveBroadcast = async (req: Request, res: Response) => {
        if (!req.youtubeRefreshToken) return res.status(401).json({ status: false, message: 'Check live broadcast - No Refresh Token!' });
        // if (!req.personInfo?.userId) return res.status(401).json({ status: false, message: 'Check live broadcast - You have to log in first!', platform:true});
        // const hostId = await this.questionService.getRoomHostByMeetingId(parseInt(req.params.meetingId));
        // if(req.personInfo.userId!==hostId) return res.status(400).json({status:false, message:'You are not allowed to enable the youtube live comments in this meeting!'});
        try {
            //check instance
            if (this.eventSourceExistence[`${req.params.meetingId}`] && this.eventSourceExistence[`${req.params.meetingId}`].youtube) {
                console.log('Fetch Youtube comment is already running, fail to create another instance!');
                res.status(400).json({ status: false, message: 'Fetch Youtube comment is already running, fail to create another instance!' });
                return;
            }
            if (this.eventSourceExistence[`${req.params.meetingId}`] && !this.eventSourceExistence[`${req.params.meetingId}`].youtube) {
                this.eventSourceExistence[`${req.params.meetingId}`].youtube = true;
                res.status(200).json({ status: true, message: 'Continue fetching comments from Youtube' });
                return;
            }
            //get access token check refresh token, may put this in guard
            const resultFromYT = await this.youtubeExchangeForAccessToken(req.youtubeRefreshToken);
            if (!resultFromYT['access_token']) return res.status(401).json({ status: false, message: 'Expired/Invalid Refresh token, please log in again!' });
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
            console.log(result);
            if (result.error) return res.status(result.error.code).json({ status: false, message: result.error.message });
            if (result.pageInfo.totalResults !== 1) return res.status(404).json({ status: false, message: 'No LiveBroadCast on Youtube!' });
            const liveChatId = result.items[0].snippet.liveChatId;
            /* fetch comments from youtube  */
            this.fetchYTComments(1, liveChatId, parseInt(req.params.meetingId), accessToken, req.youtubeRefreshToken) //setTimer, set this.eventSourceExistence
            return res.status(200).json({ status: true, message: 'Start to fetch comments from Youtube' });
        } catch (error) {
            console.error(error)
            res.status(500).json({ status: false, message: error.message });
            return;
        }
    }

    createQuestion = async (meetingId: number, message: string, platformId: number, name: string) => {
        const regex = RegExp(/(不如)+|(.唔.)+|(點)+|(幾)+|(問)+|(多數)+|(how)+|(what)+|(when)+|(why)+|(where)+|(如果)+|(\?)+|^(can)+|(呢)$/, 'i');
        if (!regex.test(message)) return;
        try {
            const question = await this.questionService.createQuestionFromPlatform(meetingId, message, platformId, name);
            this.io.in(`event:${question.meetingId}`).emit('create-question', question);
            console.log(question);
        } catch (e) {
            console.error(e);
            return;
            //do we need to notice the user here??
        }
    }
    fetchYTComments = async (userId: number, liveChatId: string, meetingId: number, accessToken: string, refreshToken: string, pageTokenStr: string = '') => {
        let pageTokenString = pageTokenStr;
        const fetchYTTimer = setInterval(async () => {
            try {
                console.log('fetch comments from Youtube');
                console.log(this.eventSourceExistence[1].youtube);
                const fetchLiveChat = await fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet&part=authorDetails&${pageTokenString}key=${process.env.YOUTUBE_API_KEY}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                const result = await fetchLiveChat.json();
                console.log(result);
                /* If access token expires in the middle of live broadcast */
                if (result.error.code === 401) {
                    this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
                    const refreshResult = await this.youtubeExchangeForAccessToken(refreshToken);
                    if (!refreshResult['access_token']) {
                        /* io emit to toggle the button */
                        this.io.in('host:'+userId).emit('youtube-stop','stop youtube live comments');
                        return
                    }
                    const newAccessToken = encodeURIComponent(refreshResult['access_token']);
                    this.fetchYTComments(userId, liveChatId, meetingId, newAccessToken, refreshToken, pageTokenString);
                    return;
                }
                /* Check if live broadcast ends */
                if (result.offlineAt) {
                    console.log('Youtube Live Chat ends')
                    this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
                    this.io.in('host:'+userId).emit('youtube-stop','stop youtube live comments');
                    return;
                }
                pageTokenString = `pageToken=${result.nextPageToken}&`;
                /* Check if user stops the live fetch function */
                if (!this.eventSourceExistence[`${meetingId}`].youtube) return;
                /* Create questions and io emit */
                for (const item of result.items) {
                    if (!item.snippet.displayMessage) continue;
                    await this.createQuestion(meetingId, item.snippet.displayMessage, 3, item.authorDetails.displayName || 'Anonymous');
                }
            } catch (e) {
                console.error(e);
                this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
                this.io.in('host:'+userId).emit('youtube-stop','stop youtube live comments');
                return;
            }
        }, 5000);
        /* Let server knows the live function is operating in which room and on which platform */
        const temp = { ...this.eventSourceExistence[`${meetingId}`], youtube: true }
        this.eventSourceExistence[`${meetingId}`] = temp;
    }
    clearTimeIntervalAndTimer = (timer: NodeJS.Timeout, platform: string, meetingId: number) => {
        clearInterval(timer);
        /* Check if only one platform is using the live function, if yes then delete the whole key, otherwise, delete only the platform key */
        if (Object.keys(this.eventSourceExistence[`${meetingId}`]).length === 1) {
            delete this.eventSourceExistence[`${meetingId}`];
            return
        }
        delete this.eventSourceExistence[`${meetingId}`][`${platform}`];
        return;
    }
    youtubeExchangeForAccessToken = async (refreshToken: string) => {
        const bodyString = 'client_id=' + process.env.GOOGLE_CLIENT_ID + '&client_secret=' + process.env.GOOGLE_CLIENT_SECRET + '&refresh_token=' + encodeURIComponent(refreshToken) + '&grant_type=refresh_token';
        const fetchRes = await fetch('https://accounts.google.com/o/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyString,
        })
        const result = await fetchRes.json();
        console.log(result);
        return result;
    }
    checkStatus = async (req: Request, res: Response) => {
        try {
            const meetingId = req.params.meetingId;
            if (!this.eventSourceExistence[`${meetingId}`]) return res.status(200).json({ status: true, message: { facebook: false, youtube: false } });
            const { youtube, facebook } = this.eventSourceExistence[`${meetingId}`];
            return res.status(200).json({ status: true, message: { youtube: youtube || false, facebook: facebook || false } });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
            return;
        }
    }
    stopGettingYoutubeComments = async (req: Request, res: Response) => {
        try {
            const meetingId = req.params.meetingId;
            if (!this.eventSourceExistence[`${meetingId}`]) return res.status(400).json({ status: false, message:'Timer not found, make sure the meetingId is correct!' });
            this.eventSourceExistence[`${meetingId}`].youtube = false;
            return res.status(200).json({ status: true, message:'Successfully stop fetching comments from youtube'});
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
            return;
        }
    }

}