import { RoomsActions } from "./actions"
import { IRoomInformation } from "../../models/IRoomInformation";
import { IUserQ, IGuest, GuestInformation } from "../../models/IUserQ";

export interface RoomState {
    roomsInformation: {
        [id: string]: IRoomInformation
    };
    userInformation: GuestInformation;
}

const initialState: RoomState = {
    roomsInformation: {},
    userInformation: { token: null, user: null }
}

export const roomsReducer = /* reducer */ (oldState = initialState, action: RoomsActions) => {
    switch (action.type) {
        case '@@ROOMS/LOADED_ROOM_INFORMATION':
            {
                const newRooms = { ...oldState.roomsInformation };

                newRooms[action.room.id] = action.room;

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
                const newUserInformation = { ...oldState.userInformation, user:action.user };
                return {
                    ...oldState,
                    userInformation: newUserInformation,
                };
            }
        case '@@ROOMS/LOGGED_IN_SUCCESS':
            {
                const newUserInformation = { ...oldState.userInformation, token:action.token };
                return {
                    ...oldState,
                    userInformation: newUserInformation,
                };
            }
        default:
            return oldState;
    }
}
