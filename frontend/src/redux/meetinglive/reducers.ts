import produce from 'immer';
import { MeetingLiveActions } from './action';

export interface IMeetingLive {
    id: number;
    name: string;
    date: Date;
    code: string;
    host: string;
}

export interface MeetingLiveState {
    meetingsLive: IMeetingLive[]
}

const initialState: MeetingLiveState = {
    meetingsLive: [
        { id: 1, name: "LiveMeeting1", date: new Date(), code: "NEW1", host: "Host1" },
        { id: 2, name: "LiveMeeting2", date: new Date(), code: "NEW2", host: "Host2" }],
}

export function MeetingLiveReducer(state: MeetingLiveState = initialState, action: MeetingLiveActions): MeetingLiveState {
    return produce(state, state => {
        switch (action.type) {
            case "@@MEETINGS/LOAD_MEETINGS":
                break;
        }
    })
}