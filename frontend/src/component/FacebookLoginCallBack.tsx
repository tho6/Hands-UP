import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { sendFacebookCode } from '../redux/live/thunk'
import { push } from 'connected-react-router'

export default function FacebookLoginCallBack() {
    const dispatch = useDispatch()
    
    useEffect(()=>{
        const params = new URLSearchParams(window.location.search)
        const state = params.get('state')
        if (params.get('error')) {
            // window.alert('We need your permission');
            const arr = state?.split(" ")!
            dispatch(push(`/room/${arr[0]}/questions/main/facebook-error`))

        }else{
            const arr = state?.split(" ")!
            dispatch(sendFacebookCode(params.get('code')!,arr[0],arr[1], arr[2]));
            console.log(params.get('code')!)
            // dispatch(push(`/room/${arr[0]}/questions/main/${arr[1]}`))      
        }

    }, [dispatch])

    return (
        <div>
            facebook login callback page
            
        </div>
    )
}
