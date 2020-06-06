import { ThunkDispatch, RootState } from "../../store";
import { loadMeetings } from "./action";
// import { IMeetingLive } from "./reducers";

export function fetchMeetingLive(meetingId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings`, {
            method: 'GET',
        })
        const result = await res.json();
        console.log(result.message);
        dispatch(loadMeetings(result.message))
    }
}