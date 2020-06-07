import { ThunkDispatch, RootState } from "../../store";
import { fetchReportQuestionsAction, fetchReportViewsAction, fetchQuestionCountOfLatestXMeetings } from "./actions";

export function fetchReportQuestions(meetingId: string | number[]){
    
    return async (dispatch: ThunkDispatch, getState:(()=>RootState)) => {
        const resFetch = await fetch(`${process.env.REACT_APP_BACKEND_URL}/report/question/${meetingId}`,{
            headers: {
                'Authorization': `Bearer ${getState().auth.accessToken}`,
            }});
        const result = await resFetch.json()
        // const result =JSON.parse(resFetch)
        // console.log('fetch Report questions: ')
        // console.log(result.message)
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
export function reportQuestionsCountOnLatestXMeetings(count:string){
    return async (dispatch: ThunkDispatch, getState:(()=>RootState)) => {
        try{
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/report/overall/meetings/count/${count}`,{
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                }});
            const result = await res.json()
            if(!result.success) return window.alert(result.message);
            dispatch(fetchQuestionCountOfLatestXMeetings(result.message));
        }catch(e){
            window.alert(e);
            return;
        }
    }
}