import express, { Request, Response } from 'express'
import fetch from 'node-fetch'

export class VideoRouter{

    constructor() {
    }

    router() {
        const router = express.Router()
        router.post('/fb/token', this.fetchAccessCode)
        router.post('/fb/comments', this.fetchComments)
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
            if(!result.access_token) return res.status(401).json({ success: false, message: "Invalid Auth Code" })
            const fetchResLongLivedToken = await fetch(`https://graph.facebook.com/v7.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&fb_exchange_token=${result.access_token}`)
            const resultLongLivedToken = await fetchResLongLivedToken.json()
            if (!resultLongLivedToken) return res.status(401).json({ success: false, message: "Exchange Long Lived User Code Error" })
            console.log(resultLongLivedToken)
            return res.status(200).json({ success: true, message:"Get Access Code Successful"})
        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
        
        
    }

    fetchComments = async (req: Request, res: Response) => {
        //egt access token
        //whcih live?? user ? page?
        const accessToken = 'EAAg3wXWlMIMBAKT6ZAcK9G2XnzHjeRHb8ZAg7htaUQA4D8kV9rZCom0D2WodSCZBNupn0uQu5RzirdJHxk1oMqbN6XhmhBk5ZAdqzcxdhS6bF1jlqkhlTUWE8GZCYZAPEfKu98j20CUDYq5ZBNjDuYYje53o8yl39Uki6JmEkURnKSzVAbGRYaim'
        const liveLoc = req.body.liveLoc
        // const liveLoc = 'user'
        let liveVideoId
        let result
        if (!liveLoc) return res.status(400).json({ success: false, message: 'Please input liveLoc variable in req.body (user/page)' })
        if (liveLoc === 'user'){
            const fetchRes = await fetch(`https://graph.facebook.com/v7.0/me/live_videos?access_token=${accessToken}`)
            result = await fetchRes.json()
            
        }else if (liveLoc === 'page'){
            if (!req.body.pageId) return res.status(400).json({ success: false, message: 'Please input pageId variable in req.body' })
            const pageId = req.body.pageId
            const fetchRes = await fetch (`https://graph.facebook.com/v7.0/${pageId}/live_videos?access_token=${accessToken}`)
            result = await fetchRes.json()
        }
        const liveVideos = result.data.filter((video:any) => video.status === "LIVE")
        if (liveVideos.length > 1) {
            return res.status(400).json({ success: false, message: "More than one live is on facebook" })
        } else if (liveVideos.length === 0) {
            console.log('no live')
            return res.status(400).json({ success: false, message: "No live is on facebook" })
        }
        liveVideoId = liveVideos[0].id
        console.log('liveVideoId: ' + liveVideoId)
        const fetchCommentsRes = await fetch (`https://streaming-graph.facebook.com/${liveVideoId}/live_comments?access_token=${accessToken}&fields=created_time,from{name},message`)
        
        // const fetchCommentsRes = await fetch (`https://graph.facebook.com/v7.0/${liveVideoId}/comments?access_token=${accessToken}&fields=created_time,from{name},message`)
        const comments = (await fetchCommentsRes.json()).data
        console.log(comments)
        return res.status(200).json({success:true, message:comments})

    }


    // get token service 
    
    //  用token睇下有冇直播
    //  用token get comments
}