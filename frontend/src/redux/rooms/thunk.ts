import { ThunkDispatch, RootState } from "../../store";
import { loadedRoomInformation, successfullyUpdatedRoomConfiguration, loadedUserInRoom, loggedInSuccessInRoom } from "./actions";
import { IRoomConfiguration } from "../../models/IRoomInformation";

// Thunk Action
export function fetchRoomInformation(meetingId: number) {
    return async (dispatch: ThunkDispatch) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/${meetingId}`, {
                credentials: "include"
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
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/user`, {
                method: 'POST',
                credentials: "include"
            });
            const result = await res.json();
            if (result.status) {
                localStorage.setItem('guestToken', result.message);
                dispatch(loggedInSuccessInRoom(result.token))
                dispatch(restoreLoginInRoom(meetingId, false))
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function restoreLoginInRoom(meetingId: number, checkIsHost:boolean) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const userToken = getState().auth.token;
        const guestToken = getState().roomsInformation.userInformation.token;
        if(userToken && checkIsHost){
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${meetingId}/user/current`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
            });
            const result = await res.json(); //res.json(status:true, message:user) user-->{userId: 1, name:'Alex', isHost:true/false}
            if (result.status) {
                result.message.isHost?dispatch(loadedUserInRoom(result.message)):dispatch(loginAsGuest(meetingId));
            } else {
                window.alert(result.message);
            }
            return;
        }
        if (guestToken != null) {
            const result = await getCurrentGuest(guestToken);
            if (result.status) {
                dispatch(loggedInSuccessInRoom(guestToken));
                dispatch(loadedUserInRoom(result.message));
            } else {
                window.alert(result.message);
            }
            return;
        }
        if (userToken == null) {
            dispatch(loginAsGuest(meetingId))
        } else {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${meetingId}/user/current`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
            });
            const result = await res.json(); //res.json(status:true, message:user) user-->{userId: 1, name:'Alex', isHost:true/false}
            if (result.status) {
                result.message.isHost?dispatch(loadedUserInRoom(result.message)):dispatch(loginAsGuest(meetingId));
            } else {
                window.alert(result.message);
            }
        }
    }
}
//getCurrentGuest --> res.json({status:true, message: guest}) guest-->{guestId: 1, name: 'Anonymous'}
async function getCurrentGuest(guestToken: string) {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/user/current`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${guestToken}`
        },
    });
    const result = await res.json();
    return result;
}
