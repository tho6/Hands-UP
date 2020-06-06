import produce from 'immer';
import { MeetingLiveActions } from './action';

export interface IMeetingLive {
    id: number;
    name: string;
    date_time: Date;
    code: string;
    url: string,
    owner_id: string;
}

export interface MeetingLiveState {
    meetingsLive: IMeetingLive[]
}

const initialState: MeetingLiveState = {
    meetingsLive: [
        { id: 1, name: "LiveMeeting1", date_time: new Date(), code: "NEW1", url: "url", owner_id: "Host1" },
        { id: 2, name: "LiveMeeting2", date_time: new Date(), code: "NEW2", url: "url", owner_id: "Host2" }],
}

export function MeetingLiveReducer(state: MeetingLiveState = initialState, action: MeetingLiveActions): MeetingLiveState {
    return produce(state, draftState => {
        switch (action.type) {
            case "@@MEETINGS/LOAD_MEETINGS":
                draftState.meetingsLive = action.meetings;
                break;
        }
    })
}