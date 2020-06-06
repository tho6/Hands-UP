import express from 'express'
import { ReportService } from '../services/ReportService'
export class ReportRouter {
    constructor(private reportService: ReportService) { }

    router() {
        const router = express.Router()
        router.get('/question/:paramsArray', this.getQuestionsByMeetingId)
        router.get('/view/:paramsArray', this.getViewsByMeetingId)
        router.get('/overall', this.getAllQuestions)
        router.get('/overall/latest-meetings', this.getQuestionsOfLatestXMeetings)
        router.get('/overall/meetings/count/:count', this.getQuestionCountOfLatestMeetings)
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
    getAllQuestions = async (req: express.Request, res: express.Response) => {
        try {
            const reportDataAllQuestions = await this.reportService.getAllQuestions();
            return res.status(200).json({success: true, message: reportDataAllQuestions})
        } catch (error) {
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }
    getQuestionsOfLatestXMeetings = async (req: express.Request, res: express.Response) => {
        try {
            const reportQuestionsOfLatestXMeetings = await this.reportService.getQuestionsOfLatestXMeetings(30);
            return res.status(200).json({success: true, message: reportQuestionsOfLatestXMeetings})
        } catch (error) {
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }
    getQuestionCountOfLatestMeetings = async (req: express.Request, res: express.Response) => {
        try {
            const reportQuestionsOfLatestXMeetings = await this.reportService.getQuestionsCountOfLatestXMeetings(parseInt(req.params.count),req.personInfo?.userId!);
            return res.status(200).json({success: true, message: reportQuestionsOfLatestXMeetings})
        } catch (error) {
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }
}