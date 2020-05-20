import { RoomsActions } from "./actions"
import { IRoomInformation } from "../../models/IRoomInformation";
import { IUserQ, IGuest, GuestInformation } from "../../models/IUserQ";

export interface RoomState {
    roomsInformation: {
        [id: string]: IRoomInformation
    };
    userInformation: GuestInformation;
}
//Initial State
const room: IRoomInformation = {
    id: 1,
    owenId: 1,
    name: 'This is Room 1',
    code: '#string',
    is_live: true,
    canModerate: false,
    canUploadFiles: false,
    questionLimit: 10
}

//Initial State
const user: (IGuest & IUserQ) | null = {
    guestId: 1,
    name: 'anonymous',
}


const initialState: RoomState = {
    roomsInformation: { 1: room },
    userInformation: { token: null, user: user }
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
