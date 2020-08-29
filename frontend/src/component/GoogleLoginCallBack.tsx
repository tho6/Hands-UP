import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loginGoogle } from '../redux/auth/thunk'
import UncontrolledLottie from './UncontrolledLottie'

export default function GoogleLoginCallBack() {
    const dispatch = useDispatch()
    useEffect(()=>{
        // console.log('in google callback')
        const params = new URLSearchParams(window.location.search)
        // console.log('dispatch google callback')
        dispatch(loginGoogle(params.get('code')!));
        // console.log(params.get('code')!)
        //dispatch(push('/'))
        // console.log('end google callback')
    }, [dispatch])

    return (
        <>
        <UncontrolledLottie />
        </>
    )
}
