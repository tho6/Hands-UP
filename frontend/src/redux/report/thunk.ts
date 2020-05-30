import { ThunkDispatch, RootState } from "../../store";
import { fetchReportQuestionsAction, fetchReportViewsAction } from "./actions";

export function fetchReportQuestions(meetingId: string | number[]){
    
    return async (dispatch: ThunkDispatch, getState:(()=>RootState)) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/report/question/${meetingId}`,{
            headers: {
                'Authorization': `Bearer ${getState().auth.accessToken}`,
            }});
        const result = await res.json()
        console.log(result)
        dispatch(fetchReportQuestionsAction(result.message))
    }
}

export function fetchReportViews(meetingId: string | number[]){
    
    return async (dispatch: ThunkDispatch, getState:(()=>RootState)) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/report/view/${meetingId}`,{
            headers: {
                'Authorization': `Bearer ${getState().auth.accessToken}`,
            }});
        const result = await res.json()
        console.log(result)
        dispatch(fetchReportViewsAction(result.message))
    }
}