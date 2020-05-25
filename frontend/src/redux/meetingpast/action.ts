import { IMeetingPast } from "./reducers";

export function loadMeetings(meetings: IMeetingPast[]) {
    return {
        type: "@@MEETINGS/LOAD_MEETINGS" as "@@MEETINGS/LOAD_MEETINGS",
        meetings
    }
}

export type MeetingPastActions = ReturnType<typeof loadMeetings>;