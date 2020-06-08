import { ThunkDispatch, RootState } from "../../store";
import { loadMeetings, deletedMeetingAction } from "./action";
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
            if (!result.status) {
                window.alert(result.message);
            }
            dispatch(deletedMeetingAction(result.message))
        } catch (err) {
            window.alert(err.message);
        }
    }
}