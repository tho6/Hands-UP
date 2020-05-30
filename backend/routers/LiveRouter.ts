import express, { Request, Response } from 'express'
import fetch from 'node-fetch'
import EventSource from 'eventsource'
import { QuestionService } from '../services'
import { checkThirdPartyPlatformToken } from '../guard';


export class LiveRouter {
    private eventSourceExistence: { [id: string]: { facebook: boolean, youtube: boolean } } = {};
    constructor(private questionService: QuestionService, private io: SocketIO.Server) { }

    router() {
        const router = express.Router()
        router.post('/fb/token', this.fetchAccessCode)
        router.post('/fb/comments', this.fetchComments)
        router.post('/fb/views', this.fetchViews)
        router.post('/yt/token', this.fetchYTAccessToken)
        router.get('/yt/comments', checkThirdPartyPlatformToken(), this.checkYTLiveBroadcast)
        router.post('/yt/views', this.fetchViews)
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
    fetchYTAccessToken = async (req: Request, res: Response) => {
        try {
            const bodyString = 'code=' + req.body.accessCode + '&client_id=' + process.env.GOOGLE_CLIENT_ID + '&client_secret=' + process.env.GOOGLE_CLIENT_SECRET + '&redirect_uri=' + process.env.GOOGLE_REDIRECT_URL + '&grant_type=authorization_code';
            console.log(bodyString);
            const fetchRes = await fetch('https://accounts.google.com/o/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: bodyString,
            })
            const result = await fetchRes.json();
            if (result.error) throw new Error(result['error_description']);
            res.status(200).json({ status: true, message: 'Successfully Exchange Access Token!' });
            console.log(result);
            return;
        } catch (e) {
            console.log(e)
            res.status(400).json({ status: false, message: 'Fail to exchange Access Token!' })
            return;
        }

    }
    checkYTLiveBroadcast = async (req: Request, res: Response) => {
        if (!req.youtubeRefreshToken) return res.status(400).json({ status: false, message: 'Check live broadcast - No Refresh Token!' })
        try {
            //check instance
            if (this.eventSourceExistence[`${req.body.meetingId}`] && this.eventSourceExistence[`${req.body.meetingId}`].youtube) {
                console.log('Fetch Youtube comment is already running, fail to create another instance!');
                res.status(400).json({ status: false, message: 'Fetch Youtube comment is already running, fail to create another instance!' });
                return;
            }
            //get access token check refresh token, may put this in guard
            const resultFromYT = await this.youtubeExchangeForAccessToken(req.youtubeRefreshToken);
            if(!resultFromYT['access_token']) return res.status(401).json({status:false, message:'Expired/Invalid Refresh token, please log in again!'});
            const accessToken = encodeURIComponent(resultFromYT['access_token']); 
            //const accessToken = 'ya29.a0AfH6SMCNak19NeHXNCm1VqZ74SY17svpITV0y7LBXvljLARhyhuZNusTVU70EHW4kZNd3elI5lsYLIAj_Ia2swmuddHEv6GNFNZA9OcveNaTlfmY2csKCSlkgQ7EvYI3I5W7nMq83qV9CXmN5wwMtw4VtVGjHdlVHIU';
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
            if (result.pageInfo.totalResults !== 1) return res.status(403).json({ status: false, message: 'No LiveBroadCast on Youtube!' });
            const liveChatId = result.items[0].snippet.liveChatId;
            //fetch comments from youtube 
            this.fetchYTComments(liveChatId, req.body.meetingId, accessToken) //setTimer, set this.eventSourceExistence
            return res.status(200).json({ status: true, message: 'Start to fetch comments from Youtube' });
        } catch (error) {
            console.error(error)
            res.status(400).json({ status: false, message: error.message });
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
    fetchYTComments = async (liveChatId: string, meetingId: number, accessToken: string, pageTokenStr: string = '') => {
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
                //check liveChat existence
                /*           if(result.error.code === 401) {
                    this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
                    refresh token exchange for access token
                    if(!result.access_token){
                        //notify user
                        return;
                    }
                    fetchYTComments(liveChatId, meetingId,  newAccessToken, pageTokenString)
                    return;
                } */
                if (result.offlineAt) {
                    console.log('Youtube Live Chat ends')
                    this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
                    return;
                }
                pageTokenString = `pageToken=${result.nextPageToken}&`;
                if (!this.eventSourceExistence[`${meetingId}`].youtube) return;
                for (const item of result.items) {
                    if (!item.snippet.displayMessage) continue;
                    await this.createQuestion(meetingId, item.snippet.displayMessage, 3, item.authorDetails.displayName || 'Anonymous');
                }
            } catch (e) {
                console.error(e);
                this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
                return;
            }
        }, 5000);
        const temp = { ...this.eventSourceExistence[`${meetingId}`], youtube: true }
        this.eventSourceExistence[`${meetingId}`] = temp;
    }
    clearTimeIntervalAndTimer = (timer: NodeJS.Timeout, platform: string, meetingId: number) => {
        clearInterval(timer);
        //maybe need to emit message to meetings owner
        if (Object.keys(this.eventSourceExistence[`${meetingId}`]).length === 1) {
            delete this.eventSourceExistence[`${meetingId}`];
            return
        }
        delete this.eventSourceExistence[`${meetingId}`][`${platform}`];
        return;
    }
    youtubeExchangeForAccessToken = async (refreshToken: string) => {
            const bodyString = 'client_id=' + process.env.GOOGLE_CLIENT_ID+ '&client_secret=' + process.env.GOOGLE_CLIENT_SECRET + '&refresh_token=' + encodeURIComponent(refreshToken) + '&grant_type=refresh_token';
            const fetchRes = await fetch('https://accounts.google.com/o/oauth2/token', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: bodyString,
            })
            const result = await fetchRes.json();
            console.log(result);
            return result;
    }

}