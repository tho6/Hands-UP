import { IReportQuestion, IReportView } from "../../models/IReport";

export function fetchReportQuestionsAction(questions: IReportQuestion[]){
    return {
        type: '@@REPORT/LOADED_QUESTIONS' as '@@REPORT/LOADED_QUESTIONS',
        questions
    }
}
export function fetchReportViewsAction(views: IReportView[]){
    return {
        type: '@@REPORT/LOADED_VIEWS' as '@@REPORT/LOADED_VIEWS',
        views
    }
}
export function fetchQuestionCountOfLatestXMeetings(questionsCount:{meetingId:number, count:number, meetingName:string, youtubePeakViews:number,facebookPeakViews:number,handsupPeakViews:number,}[] ){
    return {
        type: '@@REPORT/LOADED_COUNT_LATEST_QUESTIONS' as '@@REPORT/LOADED_COUNT_LATEST_QUESTIONS',
        questionsCount
    }
}
export function deleteReportMeeting(meetingId:number){
    return {
        type: '@@REPORT/DELETE_MEETINGS' as '@@REPORT/DELETE_MEETINGS',
        meetingId
    }
}

export type ReportActions = ReturnType<typeof fetchReportQuestionsAction> | ReturnType<typeof fetchReportViewsAction> | ReturnType<typeof fetchQuestionCountOfLatestXMeetings> | ReturnType<typeof deleteReportMeeting>