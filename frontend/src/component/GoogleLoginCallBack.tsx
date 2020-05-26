import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { loginGoogle } from '../redux/auth/thunk'
import { push } from 'connected-react-router'

export default function GoogleLoginCallBack() {
    const dispatch = useDispatch()
    useEffect(()=>{
        const params = new URLSearchParams(window.location.search)
        dispatch(loginGoogle(params.get('code')!));
        console.log(params.get('code')!)
        // dispatch(push('/'))
    }, [dispatch])

    return (
        <div>
            google login callback page
            
        </div>
    )
}