import { ThunkDispatch, RootState } from "../../store";

export function sendFacebookCode(authCode: string){
    return async (dispatch: ThunkDispatch, getState: ()=>RootState)=>{
        //fetch token
        const sendRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/video/fb/token`, {
            method: "POST",
            headers: {

                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                authCode
            })
        })
    }
}

export function checkFacebookToken(accessToken: string){
    return (dispatch: ThunkDispatch, getState: ()=>RootState)=>{
        //fetch token
        // fetch return true false --> check token valid?

    }
}