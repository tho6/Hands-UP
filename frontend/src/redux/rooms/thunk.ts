import { ThunkDispatch } from "../../store";
import { loadedRoomInformation, successfullyUpdatedRoomConfiguration, successfullyToggleYoutubeLiveStatus, loadInitialLiveStatus } from "./actions";
import { IRoomConfiguration } from "../../models/IRoomInformation";
import { tFetchRoomInformation} from "../../fakeResponse";

// Thunk Action
export function fetchRoomInformation(meetingId: number) {
    return async (dispatch: ThunkDispatch) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/${meetingId}`, {
            // }); // GET + 'memos'
            // const result = await res.json();
            const result = tFetchRoomInformation;
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
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/${meetingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(roomConfiguration)
            });
            const result = await res.json();
            if (result.status) {
                dispatch(successfullyUpdatedRoomConfiguration(meetingId, roomConfiguration));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function toggleYoutubeLiveStatus(meetingId: number, isFetch: boolean) {
    return async (dispatch: ThunkDispatch) => {
        try {
            if (isFetch) {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/yt/comments/${meetingId}`);
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
export function updateYoutubeRefreshToken(meetingId: number, code: string) {
    return async (dispatch: ThunkDispatch) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/yt/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
    return async (dispatch: ThunkDispatch) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/status/${meetingId}`);
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
