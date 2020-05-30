import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateYoutubeRefreshToken } from '../redux/rooms/thunk'
import Spinner from 'react-bootstrap/Spinner'

export default function YoutubeCallBack() {
    const dispatch = useDispatch()
    useEffect(()=>{
        const params = new URLSearchParams(window.location.search)
        const meetingId = params.get('state');
        if(!meetingId){
            window.location.replace('/');
            return;
        }
        if(params.get('error')){
            window.alert('Redirecting back to the room!');
            window.location.replace(`/room/${meetingId}/questions/main`);
            return;
        }
        const code = params.get('code')
        console.log(code);
        dispatch(updateYoutubeRefreshToken(parseInt(meetingId), code!));
    }, [dispatch])

    return (
        <div>
           <Spinner animation="grow" />
        </div>
    )
}
