import { ThunkDispatch, RootState } from "../../store";
import { loadedRoomInformation, successfullyToggleYoutubeLiveStatus, loadInitialLiveStatus, successfullyToggleFacebookLiveStatus, message, googlePermissionModal } from "./actions";
import { IRoomConfiguration } from "../../models/IRoomInformation";
import { push } from "connected-react-router";

// Thunk Action
export function fetchRoomInformation(meetingId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/${meetingId}`,{ headers: { 'Authorization': `Bearer ${getState().auth.accessToken}` } }); // GET + 'memos'
            const result = await res.json();
            if (result.status) {
                dispatch(loadedRoomInformation(result.message));
            } else {
                dispatch(message(true,result.message));
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}

export function updateRoom(meetingId: number, roomConfiguration: IRoomConfiguration) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/in/room/${meetingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getState().auth.accessToken}`
                },
                body: JSON.stringify({ roomConfiguration })
            });
            const result = await res.json();
            dispatch(message(true, result.status ? 'Updated Room Configuration' : 'Something wrong! You may try again later.'));
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function toggleYoutubeLiveStatus(meetingId: number, isFetch: boolean) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            if (isFetch) {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/yt/comments/${meetingId}`, { headers: { 'Authorization': `Bearer ${getState().auth.accessToken}` } });
                const result = await res.json();
                if (result.status) {
                    dispatch(successfullyToggleYoutubeLiveStatus(meetingId, true));
                } else {
                    dispatch(message(true, result.message));
                    if (res.status === 401) {
                        if (result.platform || false){
                            dispatch(message(true, 'Unauthenticated, please log in first'));
                            return 
                        } 
                        const loginLocation = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_YOUTUBE_REDIRECT_URL}&scope=https://www.googleapis.com/auth/youtube.readonly&state=${meetingId}&response_type=code&access_type=offline`
                        window.location.replace(loginLocation)
                    } else if (res.status === 403) {
                        if (result.platform || false) {
                            dispatch(message(true, 'You are not host!'));
                            return 
                        }
                        dispatch(googlePermissionModal(true));
                    }
                    return;
                }
            } else {
                //change the counter at liveRouter to false
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/yt/comments/${meetingId}`, { method: 'PUT' });
                const result = await res.json();
                if (!result.status) throw dispatch(message(true, result.message));
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
export function toggleFacebookLiveStatus(meetingId: number, isFetch: boolean, liveLoc: string, pageId: string = '') {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            if (isFetch) {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/fb/comments`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getState().auth.accessToken}`
                        },
                        body: JSON.stringify({ meetingId, liveLoc, pageId })
                    });
                const result = await res.json();
                if (result.success) {
                    dispatch(successfullyToggleFacebookLiveStatus(meetingId, true));
                } else {
                    dispatch(message(true,result.message));
                    if (res.status === 401) {
                        const loginLocationWithPrompt = `https://www.facebook.com/v7.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&display=page&redirect_uri=${process.env.REACT_APP_FACEBOOK_REDIRECT_URL}&state=${meetingId}+${liveLoc}+${liveLoc==='user'?'no':pageId}&scope=user_videos,pages_read_engagement,pages_read_user_content,pages_show_list`
                        window.location.replace(loginLocationWithPrompt)
                    }
                    return;
                }
            } else {
                //change the counter at liveRouter to false
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/fb/comments/${meetingId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getState().auth.accessToken}`
                        },
                    })
                const result = await res.json();
                if (!result.status) throw dispatch(message(true, result.message));
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
export function turnOnFacebookAgain(meetingId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/fb/comments/${meetingId}/on`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getState().auth.accessToken}`
                        }
                    });
                const result = await res.json();
                if (result.success) {
                    dispatch(successfullyToggleFacebookLiveStatus(meetingId, true));
                } else {
                    dispatch(message(true,result.message));
                }
        } catch (e) {
            window.alert(e.message);
            console.error(e);
            return;
        }
    }
}
export function updateYoutubeRefreshToken(meetingId: number, code: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
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
            // if (!result.status) dispatch(message(true, result.message));
            window.location.replace(`/room/${meetingId}/questions/main${result.status?'':'/youtube-error'}`);
        } catch (e) {
            window.alert(e.message);
            window.location.replace(`/room/${meetingId}/questions/main`);
        } 
    }
}
export function getLiveStatus(meetingId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/status/${meetingId}`, { headers: { 'Authorization': `Bearer ${getState().auth.accessToken}` } });
            const result = await res.json();
            if (result.status) {
                dispatch(loadInitialLiveStatus(meetingId, result.message.facebook, result.message.youtube));
            } else {
                dispatch(message(true, result.message))
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function removeToken(platform: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/token/${platform}`, {
                method:'DELETE',
                headers: { 'Authorization': `Bearer ${getState().auth.accessToken}` }
            });
            const result = await res.json();
            dispatch(message(true, result.status?'Successfully reset platform!':'Fail to reset platform! Try again Later.'))
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function convertCodeToId(code: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/convert?code=${code}`,{ headers: { 'Authorization': `Bearer ${getState().auth.accessToken}` } }); // GET + 'memos'
            const result = await res.json();
            if (result.status) {
                dispatch(push(`/room/${result.message}/questions/main`));
            } else {
                dispatch(message(true,result.message));
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
