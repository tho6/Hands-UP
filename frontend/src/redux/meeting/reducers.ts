// import produce from 'immer';
import { MeetingActions } from './action';

export interface IMeeting {
    id: number;
    name: string;
    date_time: Date;
    code: string;
    url: string,
    owner_id: string;
}

export interface MeetingState {
    [id: string]: IMeeting,
}

const initialState: MeetingState = {
    // 1: { id: 1, name: "LiveMeeting1", date_time: new Date(), code: "NEW1", url: "url", owner_id: "Host1" },
    // 2: { id: 2, name: "LiveMeeting2", date_time: new Date(), code: "NEW2", url: "url", owner_id: "Host2" }
}

export function MeetingReducer(oldState: MeetingState = initialState, action: MeetingActions): MeetingState {
    // return produce(state, draftState => {
    switch (action.type) {
        case "@@MEETINGS/LOAD_MEETINGS":
            // if (action.meetings.length === 0) return state
            const newMeeting: MeetingState = {}
            // console.log(action.meetings)
            for (const meeting of action.meetings) {
                newMeeting[meeting.id] = meeting
            }
            return newMeeting
        case '@@MEETINGS/DELETE_MEETINGS':
            const newMeetingForDelete = { ...oldState }
            delete newMeetingForDelete[action.meetingId]
            return newMeetingForDelete
        // case '@@MEETINGS/EDIT_MEETINGS':
            // const newMeetingForEdit = { ...oldState }
            // const newContent = action.content;
            // newMeetingForEdit[action.i].content = newContent;
            // return {
            //     ...oldState,
                // meeting: newMeetingForEdit
            // }
        // case '@@MEETINGS/MESSAGE':
        //         return {
        //             ...oldState,
        //             message: action.redirect?{status:action.status, message:action.message, redirect:action.redirect}:{status:action.status, message:action.message}
        //         };
        //     }

        // case '@@MEETINGS/CREATE_MEETINGS':
        //     const newMeetingForCreate = {...oldState.meeting};
        //         return {
        //             ...oldState,
        //             meeting: action.meeting
        //         }
    
        default:
            return oldState;
    }
    // })
}