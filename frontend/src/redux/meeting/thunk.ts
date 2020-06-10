import { ThunkDispatch, RootState } from "../../store";
import { loadMeetings, deleteMeetingAction, createMeetingAction } from "./action";
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
            dispatch(deleteMeetingAction(result.message))
        } catch (err) {
            window.alert(err.message);
        }
    }
}

export function createMeeting(meetingId: number, meetingContent: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const formData = new FormData();
            formData.append('content', meetingContent);

            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`
                },
                body: formData
            })
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
            dispatch(createMeetingAction(result.message))
        } catch (err) {
            window.alert(err.message);
        }
    }
}