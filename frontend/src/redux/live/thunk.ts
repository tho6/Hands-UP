import { RootState, ThunkDispatch } from "../../store"

export function sendFacebookCode(authCode: string){
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/fb/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authCode
            })
        })
        const result = await res.json() //success =true?
        console.log(result) // this

    }
}