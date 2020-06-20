import express, { Request, Response } from 'express'
import fetch from 'node-fetch'
import EventSource from 'eventsource'
import { checkThirdPartyPlatformToken } from '../guard';
import { IQuestionService } from '../models/Interface/IQuestionService';
import { UserService } from '../services/UserService';
import { LiveService } from '../services/LiveService';


export class LiveRouter {
    private eventSourceExistence: { [id: string]: { facebook: boolean, youtube: boolean } } = {};
    private viewsTimer: { [id: string]: { timerIdx: null|NodeJS.Timeout, youtube: number, facebook: number, handsup: number } } = {};
    constructor(private questionService: IQuestionService, private io: SocketIO.Server, private userService: UserService, private liveService:LiveService) { }

    router() {
        const router = express.Router()
        router.post('/fb/token', this.fetchAccessCode)
        router.post('/fb/comments', checkThirdPartyPlatformToken(this.userService, 'facebook'), this.fetchComments)
        router.post('/fb/views', checkThirdPartyPlatformToken(this.userService, 'facebook'), this.fetchViews)
        router.post('/yt/token', this.fetchYTAccessAndRefreshToken)
        router.get('/yt/comments/:meetingId([0-9]+)', checkThirdPartyPlatformToken(this.userService, 'youtube'), this.checkYTLiveBroadcast)
        router.put('/yt/comments/:meetingId([0-9]+)', this.stopGettingYoutubeComments)
        router.put('/fb/comments/:meetingId([0-9]+)', this.stopGettingFacebookComments)
        router.put('/fb/comments/:meetingId([0-9]+)/on', this.startGettingFacebookComments)
        router.get('/status/:meetingId', this.checkStatus)
        router.delete('/token/:platform', this.removeToken)
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
            if (this.eventSourceExistence[`${req.params.meetingId}`] && this.eventSourceExistence[`${req.params.meetingId}`].facebook) {
                console.log('[Instance Duplicate] Stop starting new instance for fetching facebook comments');
                res.status(400).json({ status: false, message: 'Duplicate action!' });
                return;
            }
            if (this.eventSourceExistence[`${req.params.meetingId}`] && this.eventSourceExistence[`${req.params.meetingId}`].facebook===false) {
                console.log('[Facebook] turn event Existence to true!')
                this.eventSourceExistence[`${req.params.meetingId}`].facebook = true;
                res.status(200).json({ status: true, message: 'Continue fetching comments from Facebook' });
                return;
            }
            const fetchCommentsRes = new EventSource(`https://streaming-graph.facebook.com/${liveVideoId}/live_comments?access_token=${accessToken}&fields=created_time,from{name},message`, { withCredentials: true })
            fetchCommentsRes.onmessage = async (event) => {
                if (!this.eventSourceExistence[`${req.body.meetingId}`].facebook) return;
                const eventObj = JSON.parse(event.data);
                this.createQuestion(req.body.meetingId, eventObj.message.trim(), 2, eventObj.from?.name || 'Anonymous')
            }
            let viewsCounterFB = 0;
            const checkLiveStatus = setInterval(async () => {
                const fetchRes = await fetch(`https://graph.facebook.com/v7.0/${liveVideoId}?fields=status&access_token=${accessToken}`)
                const result = await fetchRes.json()
                if (result.status.toLowerCase() !== 'live') {
                    fetchCommentsRes.close()
                    console.log('[Facebook] live closed')
                    this.clearTimeIntervalAndTimer(checkLiveStatus, 'facebook', req.body.meetingId)
                    this.io.in('host:' + req.personInfo?.userId).emit('facebook-stop', 'stop facebook live comments');
                    return;
                }
                viewsCounterFB += 1;
                if(viewsCounterFB ===4) {
                    this.fetchFBViews(req.personInfo?.userId!,req.body.meetingId, liveVideoId, accessToken);
                    viewsCounterFB = 0;
                }
            }, 5000)
            const temp = { ...this.eventSourceExistence[`${req.body.meetingId}`], facebook: true }
            this.eventSourceExistence[`${req.body.meetingId}`] = temp;
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
    fetchFBViews = async (userId:number, meetingId:number, liveVideoId: number, accessToken: string) => {
        try{
            const fetchViewRes = await fetch(`https://graph.facebook.com/v7.0/${liveVideoId}?fields=live_views&access_token=${accessToken}`)
            const liveViews = (await fetchViewRes.json()).live_views
            if(!this.viewsTimer[`${meetingId}`]) return;
            this.viewsTimer[`${meetingId}`].facebook = liveViews;
            this.io.in('host:' + userId).emit('facebook-views-update', liveViews);
            return;
        }catch(e){
            console.error(e);
            return;
        }
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
            if (this.eventSourceExistence[`${req.params.meetingId}`] && this.eventSourceExistence[`${req.params.meetingId}`].youtube) {
                console.log('[Instance Duplicate] Stop starting new instance for fetching youtube comments');
                res.status(400).json({ status: false, message: 'Duplicate action!' });
                return;
            }
            if (this.eventSourceExistence[`${req.params.meetingId}`] && this.eventSourceExistence[`${req.params.meetingId}`].youtube===false) {
                console.log('[Youtube] turn event Existence to true!')
                this.eventSourceExistence[`${req.params.meetingId}`].youtube = true;
                res.status(200).json({ status: true, message: 'Continue fetching comments from Youtube' });
                return;
            }
            //get access token check refresh token, may put this in guard
            const resultFromYT = await this.youtubeExchangeForAccessToken(req.youtubeRefreshToken);
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
            console.log('[LiveRouter] create new instance for youtube comments');
            this.fetchYTComments(videoId, req.personInfo.userId, liveChatId, parseInt(req.params.meetingId), accessToken, req.youtubeRefreshToken); //setTimer, set this.eventSourceExistence
            return res.status(200).json({ status: true, message: 'Start to fetch comments from Youtube' });
        } catch (error) {
            console.error(error)
            res.status(500).json({ status: false, message: error.message });
            return;
        }
    }

    createQuestion = async (meetingId: number, message: string, platformId: number, name: string) => {
        const regex = RegExp(/(不如)+|(.唔.)+|(點)+|(幾)+|(問)+|(多數)+|(how)+|(what)+|(when)+|(why)+|(where)+|(如果)+|(\?)+|(\？)+|^(can)+|(呢)$/, 'i');
        if (!regex.test(message)) return;
        try {
            const question = await this.questionService.createQuestionFromPlatform(meetingId, message, platformId, name);
            this.io.in(`event:${question.meetingId}`).emit('create-question', question);
        } catch (e) {
            console.error(e);
            return;
            //do we need to notice the user here??
        }
    }
    fetchYTComments = async (videoId:string, userId: number, liveChatId: string, meetingId: number, accessToken: string, refreshToken: string, pageTokenStr: string = '') => {
        let pageTokenString = pageTokenStr;
        let viewCounter = 0;
        const fetchYTTimer = setInterval(async () => {
            try {
                console.log('[LiveRouter] fetch Youtube Comments');
                const fetchLiveChat = await fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet&part=authorDetails&${pageTokenString}key=${process.env.YOUTUBE_API_KEY}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                const result = await fetchLiveChat.json();
                /* If access token expires in the middle of live broadcast */
                if (result.error) {
                    this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
                    if(result.error.code === 404){
                        this.io.in('host:' + userId).emit('youtube-stop', 'stop youtube live comments');
                        return
                    }
                    const refreshResult = await this.youtubeExchangeForAccessToken(refreshToken);
                    if (!refreshResult['access_token']) {
                        /* io emit to toggle the button */
                        this.io.in('host:' + userId).emit('youtube-stop', 'stop youtube live comments');
                        return
                    }
                    const newAccessToken = encodeURIComponent(refreshResult['access_token']);
                    this.fetchYTComments(videoId, userId, liveChatId, meetingId, newAccessToken, refreshToken, pageTokenString);
                    return;
                }
                /* Check if live broadcast ends */
                if (result.offlineAt) {
                    console.log('[Live Status] Youtube Live Chat ends')
                    this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
                    this.io.in('host:' + userId).emit('youtube-stop', 'stop youtube live comments');
                    return;
                }
                pageTokenString = `pageToken=${result.nextPageToken}&`;
                /* Check if user stops the live fetch function */
                if (!this.eventSourceExistence[`${meetingId}`].youtube) return;
                /* update views */
                viewCounter += 1;
                if(viewCounter === 4){
                    this.fetchYTViews(accessToken,videoId,userId,meetingId);
                    viewCounter = 0;
                }
                /* Create questions and io emit */
                for (const item of result.items) {
                    if (!item.snippet.displayMessage) continue;
                    await this.createQuestion(meetingId, item.snippet.displayMessage, 3, item.authorDetails.displayName || 'Anonymous');
                }
            } catch (e) {
                console.error(e);
                this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
                this.io.in('host:' + userId).emit('youtube-stop', 'stop youtube live comments');
                return;
            }
        }, 10000);
        /* Silent refresh */
        // setTimeout(async()=>{
        //     console.log('[Youtube] Silent Refresh')
        //     this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
        //     const refreshResult = await this.youtubeExchangeForAccessToken(refreshToken);
        //     if (!refreshResult['access_token']) {
        //         /* io emit to toggle the button */
        //         this.io.in('host:' + userId).emit('youtube-stop', 'stop youtube live comments');
        //         return
        //     }
        //     const newAccessToken = encodeURIComponent(refreshResult['access_token']);
        //     this.fetchYTComments(videoId, userId, liveChatId, meetingId, newAccessToken, refreshToken, pageTokenString);
        // }, 3400000);
        /* Let server knows the live function is operating in which room and on which platform */
        const temp = { ...this.eventSourceExistence[`${meetingId}`], youtube: true }
        this.eventSourceExistence[`${meetingId}`] = temp;
    }
    clearTimeIntervalAndTimer = (timer: NodeJS.Timeout, platform: string, meetingId: number) => {
        clearInterval(timer);
        /* Check if only one platform is using the live function, if yes then delete the whole key, otherwise, delete only the platform key */
        if(this.eventSourceExistence[`${meetingId}`]){
            if (Object.keys(this.eventSourceExistence[`${meetingId}`]).length === 1) {
                delete this.eventSourceExistence[`${meetingId}`];
                return
            }
            delete this.eventSourceExistence[`${meetingId}`][`${platform}`];
            return;
        }
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
        return result;
    }
    checkStatus = async (req: Request, res: Response) => {
        try {
            const meetingId = req.params.meetingId;
            if (!this.eventSourceExistence[`${meetingId}`]) return res.status(200).json({ status: true, message: { facebook: null, youtube: false } });
            const { youtube, facebook } = this.eventSourceExistence[`${meetingId}`];  
            return res.status(200).json({ status: true, message: { youtube: youtube || false, facebook: facebook===undefined?null:facebook} });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
            return;
        }
    }
    stopGettingYoutubeComments = async (req: Request, res: Response) => {
        try {
            const meetingId = req.params.meetingId;
            if (!this.eventSourceExistence[`${meetingId}`]) return res.status(400).json({ status: false, message: 'Timer not found, make sure the meetingId is correct!' });
            if(this.eventSourceExistence[`${meetingId}`].youtube === true) this.eventSourceExistence[`${meetingId}`].youtube = false;
            return res.status(200).json({ status: true, message: 'Successfully stop fetching comments from youtube' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
            return;
        }
    }
    stopGettingFacebookComments = async (req: Request, res: Response) => {
        try {
            const meetingId = req.params.meetingId;
            if (!this.eventSourceExistence[`${meetingId}`]) return res.status(400).json({ status: false, message: 'Timer not found, make sure the meetingId is correct!' });
            if(this.eventSourceExistence[`${meetingId}`].facebook === true) this.eventSourceExistence[`${meetingId}`].facebook = false;
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
            if (!this.eventSourceExistence[`${meetingId}`]) return res.status(400).json({ status: false, message: 'Timer not found, make sure the meetingId is correct!' });
            this.eventSourceExistence[`${meetingId}`].facebook = true;
            return res.status(200).json({ status: true, message: 'Successfully start fetching comments from facebook' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
            return;
        }
    }
    fetchYTViews = async (accessToken: string, videoId: string, userId: number, meetingId:number) => {
        try {
                console.log('[LiveRouter] fetch views from Youtube');
                const fetchViewRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                /* Check response */
                if (fetchViewRes.status !== 200) {
                    this.io.in('host:' + userId).emit('youtube-views-stop', 'Fail to get views count on Youtube!');
                    return;
                }
                const result = await fetchViewRes.json();
                /* check liveBroadcast status */
                if (!result.items[0].liveStreamingDetails.concurrentViewers) {
                    console.log('[Live Status] Youtube live broadcast ends...')
                    return;
                }
                const liveViews = result.items[0].liveStreamingDetails.concurrentViewers;
                if(!this.viewsTimer[`${meetingId}`]) return;
                this.viewsTimer[`${meetingId}`].youtube = liveViews;
                this.io.in('host:' + userId).emit('youtube-views-update', liveViews);
                return;
        } catch (error) {
            console.log(error)
            return;
        }
    }
    removeToken = async (req: Request, res: Response) => {
        try {
            const platform = req.params.platform;
            if (platform !== 'all' && platform !== 'youtube' && platform !== 'facebook') return res.status(400).json({ status: false, message: 'Invalid parameters' });
            if (!req.personInfo?.userId) return res.status(401).json({ status: false, message: 'You are not logged in!' });
            await this.userService.removeToken(req.personInfo.userId, platform)
            return res.status(200).json({ status: true, message: 'Successfully reset platforms!' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
            return;
        }
    }
    createViewsTimer = async (roomId: number) => {
        if (this.viewsTimer[`${roomId}`]) return;
        this.viewsTimer[`${roomId}`] = {timerIdx:null, youtube:0,facebook:0,handsup:0}
        this.viewsTimer[`${roomId}`].timerIdx = setInterval(async()=>{
            if (!this.viewsTimer[`${roomId}`]) return;
            const {youtube, facebook, handsup} = this.viewsTimer[`${roomId}`]
            try{ 
                await this.liveService.saveViews(roomId, youtube,facebook, handsup)
                console.log('[LiveRouter][viewsTimer] youtube: '+youtube+'facebook: '+facebook+'handsup: '+handsup);
            }catch(e){
                this.removeViewsTimer(roomId);
                this.createViewsTimer(roomId);
            }
        },20000)
    }
    removeViewsTimer = async (roomId: number) => {
        if (!this.viewsTimer[`${roomId}`]) return;
        clearInterval(this.viewsTimer[`${roomId}`].timerIdx!);
        delete this.viewsTimer[`${roomId}`];
    }
    updateHandsUpViewsCount(count:number, meetingId:number){
        if(!this.viewsTimer[`${meetingId}`]) return;
        this.viewsTimer[`${meetingId}`].handsup = count;
      }
}