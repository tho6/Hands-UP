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

export type ReportActions = ReturnType<typeof fetchReportQuestionsAction> | ReturnType<typeof fetchReportViewsAction>