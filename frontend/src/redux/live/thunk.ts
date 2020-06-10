import { RootState, ThunkDispatch } from "../../store"
import { push } from "connected-react-router"
import { message } from "../rooms/actions"

export function sendFacebookCode(authCode: string, meetingId:string, liveLoc:string, pageId?:string){
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/fb/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getState().auth.accessToken}`
            },
            body: JSON.stringify({
                authCode
            })
        })
        const result = await res.json() //success =true?
        if(result.success === true){
            dispatch(push(`/room/${meetingId}/questions/main/continue/${liveLoc}+${pageId==='no'?'':pageId}`))
        }else{
            dispatch(message(true, result.message));
        }

    }
}
