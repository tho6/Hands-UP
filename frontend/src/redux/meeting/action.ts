import { IMeeting } from "./reducers";

export function loadMeetings(meetings: IMeeting[]) {
    return {
        type: "@@MEETINGS/LOAD_MEETINGS" as "@@MEETINGS/LOAD_MEETINGS",
        meetings
    }
}

export function deletedMeetingAction(meetingId: number) {
    return {
        type: "@@MEETINGS/DELETE_MEETINGS" as "@@MEETINGS/DELETE_MEETINGS",
        meetingId
    }
}

export type MeetingActions = ReturnType<typeof loadMeetings> | ReturnType<typeof deletedMeetingAction>;