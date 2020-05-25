import { RootState, ThunkDispatch } from "../../store"

export function loginFacebook(authCode: string){
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/loginFacebook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authCode
            })
        })
        const result = await res.json() //sucess =true?

    }
}