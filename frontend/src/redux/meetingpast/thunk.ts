import { ThunkDispatch } from "../../store";
import { loadMeetings } from "./action";
// import { IMeetingPast } from "./reducers";

export function fetchMeetingPast(){
    return async (dispatch: ThunkDispatch) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings`)
        const json = await res.json();

        dispatch(loadMeetings(json))
    }
}