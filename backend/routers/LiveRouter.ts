import express, { Request, Response } from 'express'
import fetch from 'node-fetch'
import EventSource from 'eventsource'
import { QuestionService } from '../services'


export class LiveRouter {
//private eventSourceExistence: {[id:string]:{facebook:boolean, youtube:boolean}}
    constructor(private questionService: QuestionService, private io: SocketIO.Server) {}

    router() {
        const router = express.Router()
        router.post('/fb/token', this.fetchAccessCode)
        router.post('/fb/comments', this.fetchComments)
        router.post('/fb/views', this.fetchViews)
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
            const regex = RegExp(/(不如)+|(.唔.)+|(點)+|(幾)+|(問)+|(多數)+|(how)+|(what)+|(when)+|(why)+|(where)+|(如果)+|(\?)+|^(can)+|(呢)$/,'i');
            // const regex =  RegExp('(不如)+','g')
            fetchCommentsRes.onmessage = async (event)=> {
                console.log(event.data)
                // console.log(event.data)
                const eventObj = JSON.parse(event.data);
                console.log(eventObj.message);
                console.log(regex.test(eventObj.message.trim()))
                console.log(eventObj.message.match(regex))
                if (!regex.test(eventObj.message)) return;

                const question = await this.questionService.createQuestionFromPlatform(req.body.meetingId,eventObj.message, 2, eventObj.from?.name||'Anonymous');
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
    } catch(error) {
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

}