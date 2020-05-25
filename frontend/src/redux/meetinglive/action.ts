import { IMeetingLive } from "./reducers";

export function loadMeetings(meetings: IMeetingLive[]) {
    return {
        type: "@@MEETINGS/LOAD_MEETINGS" as "@@MEETINGS/LOAD_MEETINGS",
        meetings
    }
}

export type MeetingLiveActions = ReturnType<typeof loadMeetings>;