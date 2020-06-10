import { IMeeting } from "./reducers";

export function loadMeetings(meetings: IMeeting[]) {
    return {
        type: "@@MEETINGS/LOAD_MEETINGS" as "@@MEETINGS/LOAD_MEETINGS",
        meetings
    }
}

export function deleteMeetingAction(meetingId: number) {
    return {
        type: "@@MEETINGS/DELETE_MEETINGS" as "@@MEETINGS/DELETE_MEETINGS",
        meetingId
    }
}

export function editMeetingAction(meetingId: number) {
    return {
        type: "@@MEETINGS/EDIT_MEETINGS" as "@@MEETINGS/EDIT_MEETINGS",
        meetingId
    }
}

export function createMeetingAction(meetingId: number) {
    return {
        type: "@@MEETINGS/CREATE_MEETINGS" as "@@MEETINGS/CREATE_MEETINGS",
        meetingId
    }
}

export type MeetingActions = ReturnType<typeof loadMeetings> | ReturnType<typeof deleteMeetingAction> | ReturnType<typeof editMeetingAction> | ReturnType<typeof createMeetingAction>;