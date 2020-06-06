import { ThunkDispatch, RootState } from "../../store";
import { loadedRoomInformation, successfullyToggleYoutubeLiveStatus, loadInitialLiveStatus, successfullyToggleFacebookLiveStatus, message } from "./actions";
import { IRoomConfiguration } from "../../models/IRoomInformation";

// Thunk Action
export function fetchRoomInformation(meetingId: number) {
    return async (dispatch: ThunkDispatch) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/${meetingId}`, {
            }); // GET + 'memos'
            const result = await res.json();
            if (result.status) {
                dispatch(loadedRoomInformation(result.message));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}

export function updateRoom(meetingId: number, roomConfiguration: IRoomConfiguration) {
    return async (dispatch: ThunkDispatch) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/in/room/${meetingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({roomConfiguration})
            });
            const result = await res.json();
            dispatch(message(true,result.status?'Successfully Update Room Configuration':'Something went wrong! You may try again later.'));
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function toggleYoutubeLiveStatus(meetingId: number, isFetch: boolean) {
    return async (dispatch: ThunkDispatch, getState:()=>RootState) => {
        try {
            if (isFetch) {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/yt/comments/${meetingId}`,{headers:{ 'Authorization': `Bearer ${getState().auth.accessToken}`}});
                const result = await res.json();
                if (result.status) {
                    dispatch(successfullyToggleYoutubeLiveStatus(meetingId, true));
                } else {
                    window.alert(result.message);
                    if (res.status === 401) {
                        if(result.platform||false) return window.alert('You have to log in to our platform first!');
                        const loginLocation = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_YOUTUBE_REDIRECT_URL}&scope=https://www.googleapis.com/auth/youtube.readonly&state=${meetingId}&response_type=code&access_type=offline`
                        window.location.replace(loginLocation)
                    } else if (res.status === 403) {
                        if(!window.confirm('Press OK to redirect to login page')) return;
                        const loginLocationWithPrompt = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_YOUTUBE_REDIRECT_URL}&scope=https://www.googleapis.com/auth/youtube.readonly&state=${meetingId}&prompt=force&response_type=code&access_type=offline`
                        window.location.replace(loginLocationWithPrompt)
                    }
                    return;
                }
            } else {
                //change the counter at liveRouter to false
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/yt/comments/${meetingId}`, { method: 'PUT' });
                const result = await res.json();
                if (!result.status) throw new Error(result.message);
                dispatch(successfullyToggleYoutubeLiveStatus(meetingId, false));
                return;
            }
        } catch (e) {
            window.alert(e.message);
            console.error(e);
            return;
        }
    }
}
export function toggleFacebookLiveStatus(meetingId: number, isFetch: boolean, liveLoc:string, pageId:string='') {
    return async (dispatch: ThunkDispatch, getState:()=>RootState) => {
        try {
            if (isFetch) {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/fb/comments`,
                {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getState().auth.accessToken}`
                    },
                    body:JSON.stringify({meetingId, liveLoc, pageId})
                });
                const result = await res.json();
                if (result.success) {
                    dispatch(successfullyToggleFacebookLiveStatus(meetingId, true));
                } else {
                    window.alert(result.message);
                    if (res.status === 401){
                        const loginLocationWithPrompt = `https://www.facebook.com/v7.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&display=page&redirect_uri=${process.env.REACT_APP_FACEBOOK_REDIRECT_URL}&state=${meetingId}&scope=user_videos,pages_read_engagement,pages_read_user_content,pages_show_list`
                        window.location.replace(loginLocationWithPrompt)
                    }
                    return;
                }
            } else {
                //change the counter at liveRouter to false
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/fb/comments/${meetingId}`,
                {
                    method:'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getState().auth.accessToken}`
                    },
                })
                const result = await res.json();
                if (!result.status) throw new Error(result.message);
                dispatch(successfullyToggleFacebookLiveStatus(meetingId, false));
                return;
            }
        } catch (e) {
            window.alert(e.message);
            console.error(e);
            return;
        }
    }
}
export function updateYoutubeRefreshToken(meetingId: number, code: string) {
    return async (dispatch: ThunkDispatch, getState:()=>RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/yt/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getState().auth.accessToken}`
                },
                body: JSON.stringify({ accessCode: encodeURIComponent(code) })
            });
            const result = await res.json();
            if (!result.status) window.alert(result.message);
        } catch (e) {
            window.alert(e.message);
        } finally {
            window.location.replace(`/room/${meetingId}/questions/main`);
        }
    }
}
export function getLiveStatus(meetingId: number) {
    return async (dispatch: ThunkDispatch, getState:()=>RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/status/${meetingId}`,{ headers:{'Authorization': `Bearer ${getState().auth.accessToken}`}});
            const result = await res.json();
            if (result.status) {
                dispatch(loadInitialLiveStatus(meetingId, result.message.facebook, result.message.youtube));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
