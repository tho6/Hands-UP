import express, { Request, Response } from 'express';
import { getAsync, getHallAsync, setHmAsync, delAsync } from '../redisClient';
import { LiveService } from '../services/LiveService';
import { UserService } from '../services/UserService';
import { FacebookRouter } from './FacebookRouter';
import { YoutubeRouter } from './YoutubeRouter';


export class LiveRouterV2 {
    private viewsTimerMap: { [id: string]: NodeJS.Timeout } = {};
    constructor(private userService: UserService, private liveService: LiveService, private facebookRouter: FacebookRouter, private youtubeRouter: YoutubeRouter) { }

    router() {
        const router = express.Router()
        router.use('/yt', this.youtubeRouter.router())
        router.use('/fb', this.facebookRouter.router())
        router.get('/status/:meetingId', this.checkStatus)
        router.delete('/token/:platform', this.removeToken)
        return router

    }

    checkStatus = async (req: Request, res: Response) => {
        try {
            const meetingId = req.params.meetingId;
            const youtubeExistence = await getAsync(`EVENTSOURCE_${meetingId}_YOUTUBE`).then((data: any) => data)
            const facebookExistence = await getAsync(`EVENTSOURCE_${meetingId}_FACEBOOK`).then((data: any) => data)
            if (youtubeExistence === undefined && facebookExistence === undefined) return res.status(200).json({ status: true, message: { facebook: null, youtube: false } });
            const youtube = youtubeExistence === undefined ? false : youtubeExistence === "true"
            const facebook = youtubeExistence === undefined ? null : facebookExistence === "true"
            return res.status(200).json({ status: true, message: { youtube, facebook } });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
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
        const viewsTimer = await getHallAsync(`VIEWS_TIMER_${roomId}`).then((data: any) => data?.status ?? null)
        if (viewsTimer === "true") return;
        await setHmAsync(`VIEWS_TIMER_${roomId}`, "status", "true", "youtube", "0", "facebook", "0", "handsup", "0")
        const timer = setInterval(async () => {
            const viewsTimer = await getHallAsync(`VIEWS_TIMER_${roomId}`).then((data: any) => data)
            const { status, youtube, handsup, facebook } = viewsTimer
            // console.log(status, youtube, handsup, facebook)
            if (status !== "true") return;
            try {
                await this.liveService.saveViews(roomId, parseInt(youtube), parseInt(facebook), parseInt(handsup))
                console.log('[LiveRouter][viewsTimer] youtube: ' + youtube + 'facebook: ' + facebook + 'handsup: ' + handsup);
            } catch (e) {
                this.removeViewsTimer(roomId);
                this.createViewsTimer(roomId);
            }
        }, 20000)
        this.viewsTimerMap[roomId] = timer;
    }
    removeViewsTimer = async (roomId: number) => {
        await delAsync(`VIEWS_TIMER_${roomId}`)
        if (!this.viewsTimerMap[`${roomId}`]) return;
        clearInterval(this.viewsTimerMap[`${roomId}`]);
        delete this.viewsTimerMap[`${roomId}`];
    }
    async updateHandsUpViewsCount(count: number, meetingId: number) {
        const viewsTimer = await getHallAsync(`VIEWS_TIMER_${meetingId}`).then((data: any) => data.status)
        if (viewsTimer !== "true") return;
        setHmAsync(`VIEWS_TIMER_${meetingId}`, "handsup", `${count}`)
    }
}