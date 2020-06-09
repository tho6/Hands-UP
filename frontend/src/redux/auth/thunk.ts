import { ThunkDispatch } from "../../store";
import { loginSuccess, loginFailed, getPersonInfo } from "./actions";
import { push } from "connected-react-router";
import { RootState } from '../../store'
import jwt from 'jsonwebtoken'
const timeOutId: Array<any> = []
export function loginGuest() {
    return async (dispatch: ThunkDispatch) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/loginGuest`, {
            method: 'POST',
        })
        const result = await res.json()
        if (result.success) {
            for (const id of timeOutId) {
                clearTimeout(id)
            }
            const accessToken = result.message.accessToken
            const refreshToken = result.message.refreshToken
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            dispatch(loginSuccess(accessToken, refreshToken))
            dispatch(restoreLogin())
            // dispatch(push('/'))
        } else {
            dispatch(loginFailed('Failed to login'))
        }

    }
}

export function loginGoogle(authCode: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const accessToken = getState().auth.accessToken
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/loginGoogle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                authCode
            })

        })
        const result = await res.json()
        if (result.success) {
            for (const id of timeOutId) {
                clearTimeout(id)
            }
            const accessToken = result.message.accessToken
            const refreshToken = result.message.refreshToken
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            dispatch(loginSuccess(accessToken, refreshToken))
            dispatch(restoreLogin())
            // dispatch(push('/'));
window.location.replace('/');
        } 
    }
}

export function restoreLogin() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const accessToken = getState().auth.accessToken
        const refreshToken = getState().auth.refreshToken
        // console.log('restore')
        if (!accessToken || !refreshToken) {
            window.alert('no tokenssssss')
            return
        }
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/current`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            }
        })
        const result = await res.json()
        if (!result.success) {
            window.alert(result.message)
            // dispatch(logout())
            return
        }
        dispatch(getPersonInfo(result.message.personInfo))
        return
    }
}

export function checkToken() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const accessToken = getState().auth.accessToken
        const refreshToken = getState().auth.refreshToken
        
        if (!accessToken || !refreshToken) {
            dispatch(loginGuest())
            return
        }
        const accessTokenDecode: any = jwt.decode(accessToken);
        console.log('accessTokenDecodes');
        console.log(accessTokenDecode);
        const refreshBuffer = 4 * 1000;
        const expiryTimeLeft = accessTokenDecode?.exp * 1000 - new Date().getTime()
        console.log('expiryTimeLeft ' + expiryTimeLeft)
        const genAccessCode = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken
                })
            })
            const result = await res.json()
            if (!result.success) {
                // window.alert(result.message)
                // dispatch(logout())
                dispatch(loginGuest())
            }
            localStorage.setItem('accessToken', result.message.accessToken)
            dispatch(loginSuccess(result.message.accessToken, refreshToken))
        }
        if (expiryTimeLeft < refreshBuffer) {
            await genAccessCode()
        } else {
           dispatch(restoreLogin());
            const id = setTimeout(async () => {
                await genAccessCode()
                clearTimeout(id);
            }, expiryTimeLeft - refreshBuffer)
        }
    }
}

export function logoutAccount() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const refreshToken = getState().auth.refreshToken
        // const accessToken = getState().auth.accessToken
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken
            })
        })

        const result = await res.json();
        if (result.success) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            // dispatch(logout())
window.location.replace('/');
            return
            // return window.alert(result.message)
        } else {
            return window.alert(result.message)
        }
    }
}
