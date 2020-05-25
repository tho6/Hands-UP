import produce from 'immer';
import { MeetingPastActions } from './action';

export interface IMeetingPast {
    id: number;
    name: string;
    date: Date;
    code: string;
    host: string;
}

export interface MeetingPastState {
    meetingsPast: IMeetingPast[]
    // meetingsById: {
    //     [meetingId: string]: MeetingPast
    // }
    // meetings: number[],
    // meetingDate: Date
}

// export interface MeetingPastState {
//     meetingsById: {
//         [meetingId: string]: MeetingPast
//     }
//     meetings: number[],
//     meetingDate: Date
// }

const initialState: MeetingPastState = {
    meetingsPast: [
        { id: 1, name: "PastMeeting1", date: new Date(), code: "PAST1", host: "Host1" },
        { id: 2, name: "PastMeeting2", date: new Date(), code: "PAST2", host: "Host2" },
        { id: 3, name: "PastMeeting3", date: new Date(), code: "PAST3", host: "Host3" }],
    // meetingsById: {},
    // meetings: [],
    // meetingDate: new Date()
}

export function MeetingPastReducer(state: MeetingPastState = initialState, action: MeetingPastActions): MeetingPastState {
    return produce(state, state => {
        switch (action.type) {
            case "@@MEETINGS/LOAD_MEETINGS":
                // for (const meeting of action.meetings) {
                //     state.meetingsById[meeting.id] = meeting
                // }
                // state.meetings = action.meetings.map(meeting => meeting.id);
                break;
        }
    })
}