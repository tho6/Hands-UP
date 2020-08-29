import { ThunkDispatch, RootState } from "../../store";
import { loadMeetings, deleteMeetingAction, editMeetingAction } from "./action";
import { StateValues } from "react-use-form-state";
import { message } from "../rooms/actions";
import { deleteReportMeeting } from "../report/actions";
// import { IMeetingLive } from "./reducers";

export function fetchMeeting(meetingId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getState().auth.accessToken}`
            },
        })
        const result = await res.json();
        console.log(result.message);
        // if (!result.message.message) {
        //     return      
        // }
        dispatch(loadMeetings(result.message))
        return
    }
}

export function createMeeting(meetingContent: StateValues<any>, datetime: Date, onClose:()=>void) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            console.log(meetingContent)
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getState().auth.accessToken}`
                },
                body: JSON.stringify({meetingContent,datetime})
            })
            const result = await res.json();
            if (!result.meeting_id) {
                console.log(result)
                window.alert(result.message??"Invalid form input");
                return false;
            }
            dispatch(fetchMeeting(result.meeting_id))
            // dispatch(createMeetingAction(result.meetingId))
            console.log(result)
            onClose();
            return true;
        } catch (err) {
            console.log(err.message);
            // window.alert(err.message);
        }
    }
}

export function deleteMeeting(meetingId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/delete/${meetingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`
                },
            })
            const result = await res.json();
            if (!result.success) {
                console.log(result.message);
                // window.alert(result.message);
            }
            dispatch(deleteMeetingAction(result.message))
            dispatch(deleteReportMeeting(result.message))
            // dispatch(fetchMeeting(0))
            return;
        } catch (err) {
            console.log(err.message);
            // window.alert(err.message);
        }
    }
}

export function editMeeting(meetingId: number, name: string, code:string, dateTime:Date) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/edit/${meetingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({name, code, dateTime})

            })
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
                // dispatch(message(true, result.message));
                return;
            }
            dispatch(editMeetingAction(meetingId, code, dateTime ,name))
            return;
        } catch (err) {
            console.log(err.message);
            // window.alert(err.message);
        }
    }
}

// export function enterMeetingRoom(code: string) {
//     return async (dispatch: ThunkDispatch, getState: () => RootState) => {
//         try {
//             const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/${code}`,{ headers: { 'Authorization': `Bearer ${getState().auth.accessToken}` } });
//             const result = await res.json();
//             if (result.status) {
//                 dispatch(push(`/room/${result.message}/questions/main`));
//             }
//         } catch (e) {
//             window.alert(e.message);
//         }
//     }
// // }