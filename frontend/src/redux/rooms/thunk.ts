import { ThunkDispatch, RootState } from "../../store";
import { loadedRoomInformation, successfullyUpdatedRoomConfiguration, loadedUserInRoom, loggedInSuccessInRoom } from "./actions";
import { IRoomConfiguration } from "../../models/IRoomInformation";
import { tFetchRoomInformation, tLoginAsGuest, tUserIsNotAHost, tCurrentGuest, tUserToken, tGuestToken, tCurrentHost } from "../../fakeResponse";

// Thunk Action
export function fetchRoomInformation(meetingId: number) {
    return async (dispatch: ThunkDispatch) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/${meetingId}`, {
            //     credentials: "include"
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
                credentials: "include",
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
export function loginAsGuest(meetingId: number) { //this actually means create a new guest
    return async (dispatch: ThunkDispatch) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/user`, {
            //     method: 'POST',
            //     credentials: "include"
            // });
            // const result = await res.json();
            const result = tLoginAsGuest
            if (result.status) {
                localStorage.setItem('token', result.message);
                dispatch(loggedInSuccessInRoom(result.message))
                dispatch(restoreLoginInRoom(meetingId))
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function restoreLoginInRoom(meetingId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const userToken = getState().roomsInformation.token;
        if(userToken){
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${meetingId}/user/current`, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${userToken}`
            //     },
            // });
            // const result = await res.json(); //res.json(status:true, message:user) user-->{userId: 1, name:'Alex', isHost:true/false}
            const result = tCurrentHost;
            if (result.status) {
                dispatch(loadedUserInRoom(result.message.user, result.message.meetingId));
            } else {
                window.alert(result.message);
            }
            return;
        }
            //if no token
            dispatch(loginAsGuest(meetingId));
    }
}
