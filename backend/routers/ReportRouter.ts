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
            const userMeeting = userMeetingIds.map((obj:any) => (obj.id+''))
            let resultMeeting
            const searchString = req.params?.paramsArray
            if (searchString == 'all'){
                resultMeeting = userMeeting
            }else{
                const searchArrayPre = searchString.split(',')
                const searchArray = searchArrayPre.map(v=>v.trim())
                // console.log(searchArray)
                // console.log(userMeeting)
                resultMeeting = userMeeting.filter(function(obj:string) { return searchArray.indexOf(obj) != -1; });
                console.log('else: '+resultMeeting)
            }
            console.log('userId: '+req.personInfo?.userId!)
            
            // const searchString = resultMeetingIds
            if (resultMeeting.length === 0) {
                return res.status(400).json({ success: false, message: 'Please Input meetingId to search question' })
            }
            // const searchArrayPre = searchString.split(',')
            // const searchArray = searchArrayPre.map(v => parseInt(v.trim()))
            const result = await this.reportService.getQuestionReportDataByMeetingId(resultMeeting)
            console.log('router: ')
            console.log(result)
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
            const userMeeting = userMeetingIds.map((obj:any) => (obj.id+''))
            let resultMeeting
            const searchString = req.params?.paramsArray
            if (searchString == 'all'){
                resultMeeting = userMeeting
            }else{
                const searchArrayPre = searchString.split(',')
                const searchArray = searchArrayPre.map(v=>v.trim())
                console.log(searchArray)
                console.log(userMeeting)
                resultMeeting = userMeeting.filter(function(obj:string) { return searchArray.indexOf(obj) != -1; });
                console.log('else: '+resultMeeting)
            }
            console.log('userId: '+req.personInfo?.userId!)
            
            // const searchString = resultMeetingIds
            if (resultMeeting.length === 0) {
                return res.status(400).json({ success: false, message: 'Please Input meetingId to get views' })
            }
            // // const searchString = req.params?.paramsArray
            // const resultMeeting = await this.reportService.getMeetingIdsById(req.personInfo?.userId!)
            // console.log('userId: '+req.personInfo?.userId!)
            // const searchArray = resultMeeting.map((obj:any) => obj.id)
            // if (searchArray.length === 0) {
            //     return res.status(400).json({ success: false, message: 'Please Input meetingId to get views' })
            // }
            // // const searchArrayPre = searchString.split(',')
            // // const searchArray = searchArrayPre.map(v => parseInt(v.trim()))
            const result = await this.reportService.getViewsByMeetingId(resultMeeting)
            return res.status(200).json({success: true, message: result})

        } catch (error) {
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }
}