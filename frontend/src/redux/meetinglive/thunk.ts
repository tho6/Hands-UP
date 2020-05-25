import { ThunkDispatch } from "../../store";
import { loadMeetings } from "./action";
// import { IMeetingLive } from "./reducers";

export function fetchMeetingLive(){
    return async (dispatch: ThunkDispatch) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings`)
        const json = await res.json();

        dispatch(loadMeetings(json))
    }
}