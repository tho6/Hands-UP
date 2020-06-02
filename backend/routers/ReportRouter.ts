import express from 'express'
import { ReportService } from '../services/ReportService'
export class ReportRouter {
    constructor(private reportService: ReportService) { }

    router() {
        const router = express.Router()
        router.get('/question/:paramsArray', this.getQuestionsByMeetingId)
        router.get('/view/:paramsArray', this.getViewsByMeetingId)
        return router
    }

    getQuestionsByMeetingId = async (req: express.Request, res: express.Response) => {
        try {
            const userMeetingIds = await this.reportService.getMeetingIdsById(req.personInfo?.userId!)
            const userMeeting = userMeetingIds.map((obj:{id:number}) => (obj.id+''))
            let resultMeeting
            const searchString = req.params?.paramsArray
            if (searchString == 'all'){
                resultMeeting = userMeeting
            }else{
                const searchArrayPre = searchString.split(',')
                const searchArray = searchArrayPre.map(v=>v.trim())
                resultMeeting = userMeeting.filter(function(obj:string) { return searchArray.indexOf(obj) != -1; });
            }            
            if (resultMeeting.length === 0) {
                return res.status(400).json({ success: false, message: 'Please Input meetingId to search question' })
            }

            const result = await this.reportService.getQuestionReportDataByMeetingId(resultMeeting)

            res.status(200).json({success: true, message: result})
            return 

        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }

    getViewsByMeetingId = async (req: express.Request, res: express.Response) => {
        try {
            const userMeetingIds = await this.reportService.getMeetingIdsById(req.personInfo?.userId!)
            const userMeeting = userMeetingIds.map((obj:{id:number}) => (obj.id+''))
            let resultMeeting
            const searchString = req.params?.paramsArray
            if (searchString == 'all'){
                resultMeeting = userMeeting
            }else{
                const searchArrayPre = searchString.split(',')
                const searchArray = searchArrayPre.map(v=>v.trim())
                resultMeeting = userMeeting.filter(function(obj:string) { return searchArray.indexOf(obj) != -1; });
            }
            
            if (resultMeeting.length === 0) {
                return res.status(400).json({ success: false, message: 'Please Input meetingId to get views' })
            }
            
            const result = await this.reportService.getViewsByMeetingId(resultMeeting)
            return res.status(200).json({success: true, message: result})

        } catch (error) {
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }
}