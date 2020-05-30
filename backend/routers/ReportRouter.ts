import express from 'express'
import { ReportService } from '../services/ReportService'
export class ReportRouter {
    constructor(private reportService: ReportService) { }

    router() {
        const router = express.Router()
        router.get('/question/:paramsArray')
        router.get('/view')
        return router
    }

    getQuestionsByMeetingId = async (req: express.Request, res: express.Response) => {
        try {
            const searchString = req.params?.paramsArray
            if (!searchString) {
                return res.status(400).json({ success: false, message: 'Please Input meetingId to search question' })
            }
            const searchArrayPre = searchString.split(',')
            const searchArray = searchArrayPre.map(v => parseInt(v.trim()))
            const result = await this.reportService.getQuestionReportDataByMeetingId(searchArray)
            return res.status(200).json({success: true, message: result})

        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }

    getViewsByMeetingId = async (req: express.Request, res: express.Response) => {
        try {
            const searchString = req.params?.paramsArray
            if (!searchString) {
                return res.status(400).json({ success: false, message: 'Please Input meetingId to get views' })
            }
            const searchArrayPre = searchString.split(',')
            const searchArray = searchArrayPre.map(v => parseInt(v.trim()))
            const result = await this.reportService.getViewsByMeetingId(searchArray)
            return res.status(200).json({success: true, message: result})

        } catch (error) {
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }
}