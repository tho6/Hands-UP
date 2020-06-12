import { ThunkDispatch, RootState } from "../../store";
import { loadMeetings, deleteMeetingAction } from "./action";
import { StateValues } from "react-use-form-state";
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
        // console.log(result.message);
        // if (!result.message.message) {
        //     return      
        // }
        dispatch(loadMeetings(result.message))
        return
    }
}

export function createMeeting(meetingContent: StateValues<any>) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            console.log(meetingContent)
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getState().auth.accessToken}`
                },
                body: JSON.stringify(meetingContent)
            })
            const result = await res.json();
            if (!result.meeting_id) {
                console.log(result)
                window.alert(result);
                return;
            }
            dispatch(fetchMeeting(result.meeting_id))
            // dispatch(createMeetingAction(result.meetingId))
            console.log(result)
            return;
        } catch (err) {

            window.alert(err.message);
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
                window.alert(result.message);
            }
            dispatch(deleteMeetingAction(result.message))
            // dispatch(fetchMeeting(0))
            return;
        } catch (err) {
            window.alert(err.message);
        }
    }
}

// export function editMeeting(i: number, content: string) {
//     return async (dispatch: ThunkDispatch, getState: () => RootState) => {
//         try {
//             const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/edit/${i}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${getState().auth.accessToken}`,
//                     'Content-Type':'application/json'
//                 },
//                 body:{
//                     content:content
//                 }

//             })
//             const result = await res.json();
//             if (!result.success) {
//                 window.alert(result.message);
//             }
//             dispatch(editMeetingAction(content))
//             // dispatch(fetchMeeting(0))
//             return;
//         } catch (err) {
//             window.alert(err.message);
//         }
//     }
// }

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