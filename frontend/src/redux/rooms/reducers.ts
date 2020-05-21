import { RoomsActions } from "./actions"
import { IRoomInformation } from "../../models/IRoomInformation";
import { IGuest } from "../../models/IUserQ";

export interface RoomState {
    roomsInformation: {
        [id: string]: IRoomInformation
    };
    token: string | null;
}

const initialState: RoomState = {
    roomsInformation: {},
    token: localStorage.getItem('token'),
}

export const roomsReducer = /* reducer */ (oldState = initialState, action: RoomsActions) => {
    switch (action.type) {
        case '@@ROOMS/LOADED_ROOM_INFORMATION':
            {
                const newRooms = { ...oldState.roomsInformation };
                newRooms[action.room.id] = {...oldState.roomsInformation[action.room.id], ...action.room};

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
                const newRoomInformation = { ...oldState.roomsInformation};
                newRoomInformation[action.meetingId] = {...oldState.roomsInformation[action.meetingId], userInformation: action.user};
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
        default:
            return oldState;
    }
}
