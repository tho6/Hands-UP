import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { sendFacebookCode } from '../redux/live/thunk'
import { push } from 'connected-react-router'

export default function FacebookLoginCallBack() {
    const dispatch = useDispatch()
    useEffect(()=>{
        const params = new URLSearchParams(window.location.search)
        if (params.get('error')) {
            window.alert('We need your permission')
        }else{
            dispatch(sendFacebookCode(params.get('code')!));
            console.log(params.get('code')!)
            dispatch(push('/'))
        }

    }, [dispatch])

    return (
        <div>
            facebook login callback page
            
        </div>
    )
}
