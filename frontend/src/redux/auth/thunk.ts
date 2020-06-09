import { ThunkDispatch } from "../../store";
import { loginSuccess, loginFailed, getPersonInfo } from "./actions";
import { push } from "connected-react-router";
import { RootState } from '../../store'
import jwt from 'jsonwebtoken'
import { useRef } from "react";
const timeOutId: Array<any> = []
let pastAccessTokens:string[] =[]
export function loginGuest() {
    return async (dispatch: ThunkDispatch) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/loginGuest`, {
            method: 'POST',
        })
        const result = await res.json()
        if (result.success) {
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
        console.log('------------------------start')
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
            console.log('Google login Success & start clean timout')
            for (const id of timeOutId) { // changed this
                console.log('id: '+id + ' cleaning Timeout')
                clearTimeout(id)
            }
            const accessToken = result.message.accessToken
            const refreshToken = result.message.refreshToken
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            dispatch(loginSuccess(accessToken, refreshToken))
            dispatch(restoreLogin())

            //dispatch(push('/'))
        } else {
            window.alert(result.message)
            dispatch(loginFailed('Failed to login'))
        }
    }
}

export function restoreLogin() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const accessToken = getState().auth.accessToken
        const refreshToken = getState().auth.refreshToken
        // console.log('restore')
        if (!accessToken || !refreshToken) {
            // dispatch(logout())
            dispatch(loginGuest())
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
            // window.alert(result.message)
            // dispatch(logout())
            return
        }
        // console.log(result)
        dispatch(getPersonInfo(result.message.personInfo))
        // dispatch(loginSuccess(accessToken, refreshToken)) //changed ****
        // console.log('got personInfo/n' + result.message.personInfo)
        return
    }
}

export function checkToken() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        console.log('getting in checkToken')
        const accessToken = getState().auth.accessToken
        const refreshToken = getState().auth.refreshToken
        console.log('accessToken: '+accessToken)
        if (!accessToken || !refreshToken) {
            // dispatch(logout())
            //dispatch(loginGuest())
            // console.log('checktoken logout')
            return
        }
        if (pastAccessTokens.indexOf(accessToken)>-1){
            return console.log('used access token')
        }else{
            pastAccessTokens.push(accessToken)
        }
        console.log('pastAccessTokens:' + pastAccessTokens)
        const accessTokenDecode: any = jwt.decode(accessToken)
        const refreshBuffer = 10 * 1000
        const expiryTimeLeft = accessTokenDecode?.exp * 1000 - new Date().getTime()
        console.log('expiryTimeLeft ' + expiryTimeLeft)
        const genAccessCode = async () => {
            for (const id of timeOutId) {
                clearTimeout(id)
            }
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
            // console.log('gened code')
        }
        if (expiryTimeLeft < refreshBuffer) {
            console.log('gen immediately')
            await genAccessCode()
        } else{
            console.log('create a setTimeout')
            const id = setTimeout(async () => {
                console.log('gen ing in setTimeOut')
                await genAccessCode()
                dispatch(restoreLogin())
                clearTimeout(id);
            }, 99999 - refreshBuffer)
            timeOutId.push(id)
        }
    }
}

export function logoutAccount() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const refreshToken = getState().auth.refreshToken
        // const accessToken = getState().auth.accessToken
        for (const id of timeOutId) {
            clearTimeout(id)
        }
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
        //     // localStorage.removeItem('accessToken')
        //     // localStorage.removeItem('refreshToken')
            // dispatch(logout())
            dispatch(loginGuest())
            dispatch(push('/'))
            return
            // return window.alert(result.message)
        } else {
            return window.alert(result.message)
        }
    }
}
