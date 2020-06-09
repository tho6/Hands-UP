import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loginGoogle } from '../redux/auth/thunk'
import { push } from 'connected-react-router'

export default function GoogleLoginCallBack() {
    const dispatch = useDispatch()
    useEffect(()=>{
        const params = new URLSearchParams(window.location.search)
        dispatch(loginGoogle(params.get('code')!));
        console.log(params.get('code')!)
        window.location.replace('/')
        // dispatch(push('/'))
    }, [dispatch])

    return (
        <div>
            google login callback page
            
        </div>
    )
}
