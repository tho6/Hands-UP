import { ThunkDispatch, RootState } from "../../store";
import { loadedRoomInformation, successfullyUpdatedRoomConfiguration, loadedUserInRoom, loggedInSuccessInRoom, successfullyToggleYoutubeLiveStatus } from "./actions";
import { IRoomConfiguration } from "../../models/IRoomInformation";
import { tFetchRoomInformation, tLoginAsGuest, tUserIsNotAHost, tCurrentGuest, tUserToken, tGuestToken, tCurrentHost } from "../../fakeResponse";

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
                // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/yt/comments`, {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({ meetingId })
                // });
                // const result = await res.json();
                const result ={status:true, message:'ok'}
                if (result.status) {
                    dispatch(successfullyToggleYoutubeLiveStatus(meetingId, isFetch));
                } else {
                    window.alert(result.message);
                    //redirect to google login
                    return;
                }
            } else {
                //change the counter at liveRouter to false
                // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/live/yt/comments`, {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({ meetingId })
                // });
                // const result = await res.json();
                const result ={status:true, message:'ok'}
                if (!result.status) throw new Error(result.message);
                dispatch(successfullyToggleYoutubeLiveStatus(meetingId, isFetch));
                return;
            }
        } catch (e) {
            window.alert(e.message);
            console.error(e);
            return;
        }
    }
}
