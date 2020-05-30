import { RoomsActions } from "./actions"
import { IRoomInformation } from "../../models/IRoomInformation";

export interface RoomState {
    roomsInformation: {
        [id: string]: IRoomInformation
    };
    questionLimitStatus: { [id: string]: { isChecking: boolean, count: number } };
    liveStatus: { [id: string]: { facebook: boolean, youtube: boolean } }
}

const initialState: RoomState = {
    roomsInformation: {},
    questionLimitStatus: {},
    liveStatus: {}

}

export const roomsReducer = /* reducer */ (oldState = initialState, action: RoomsActions) => {
    switch (action.type) {
        case '@@ROOMS/LOADED_ROOM_INFORMATION':
            {
                const newRooms = { ...oldState.roomsInformation };
                newRooms[action.room.id] = { ...oldState.roomsInformation[action.room.id], ...action.room };

                return {
                    ...oldState,
                    roomsInformation: newRooms,
                };
            }
        case '@@ROOMS/UPDATE_ROOM_INFORMATION':
            {
                const newRooms = { ...oldState.roomsInformation };

                newRooms[action.roomId] = { ...newRooms[action.roomId], ...action.configuration }

                return {
                    ...oldState,
                    roomsInformation: newRooms,
                };
            }
        case '@@ROOMS/LOADED_USER':
            {
                const newRoomInformation = { ...oldState.roomsInformation };
                newRoomInformation[action.meetingId] = { ...oldState.roomsInformation[action.meetingId], userInformation: action.user };
                return {
                    ...oldState,
                    roomsInformation: newRoomInformation,
                };
            }
        case '@@ROOMS/LOGGED_IN_SUCCESS':
            {
                return {
                    ...oldState,
                    token: action.token
                };
            }
        case '@@ROOMS/SET_STATUS_OF_QUESTION_LIMIT':
            {
                const newQuestionLimitStatus = { ...oldState.questionLimitStatus }
                const newStatus = { ...oldState.questionLimitStatus[action.meetingId], isChecking: action.isChecking }
                if (action.isChecking) {
                    const c = newStatus.count || 0;
                    newStatus.count = c + 1;
                } else {
                    newStatus.count = 0;
                }
                newQuestionLimitStatus[action.meetingId] = newStatus;

                return {
                    ...oldState,
                    questionLimitStatus: newQuestionLimitStatus
                };
            }
        case '@@ROOMS/TOGGLE_YOUTUBE_LIVE_STATUS':
            {
                const newLiveStatus = { ...oldState.liveStatus }
                const newStatus = { ...oldState.liveStatus[action.meetingId], youtube: action.isFetch }
                newLiveStatus[action.meetingId] = newStatus;

                return {
                    ...oldState,
                    liveStatus: newLiveStatus
                };
            }
        case '@@ROOMS/LOAD_INITIAL_LIVE_STATUS':
            {
                const newLiveStatus = { ...oldState.liveStatus }
                newLiveStatus[action.meetingId] = { youtube: action.youtube, facebook: action.facebook };
                return {
                    ...oldState,
                    liveStatus: newLiveStatus
                };
            }
        default:
            return oldState;
    }
}
