import { IRoomInformation, IRoomConfiguration } from "../../models/IRoomInformation";
import { IUserQ, IGuest } from "../../models/IUserQ";

export function loadedRoomInformation(room: IRoomInformation) {
    return {
        type: '@@ROOMS/LOADED_ROOM_INFORMATION' as '@@ROOMS/LOADED_ROOM_INFORMATION',
        room
    }
}
export function successfullyUpdatedRoomConfiguration(meetingId: number, configuration: IRoomConfiguration) {
    return {
        type: '@@ROOMS/UPDATE_ROOM_INFORMATION' as '@@ROOMS/UPDATE_ROOM_INFORMATION',
        roomId: meetingId,
        configuration
    }
}
export function loadedUserInRoom(user: (IUserQ & IGuest)) {
    return {
        type: '@@ROOMS/LOADED_USER' as '@@ROOMS/LOADED_USER',
        user
    }
}
export function loggedInSuccessInRoom(token: string) {
    return {
        type: '@@ROOMS/LOGGED_IN_SUCCESS' as '@@ROOMS/LOGGED_IN_SUCCESS',
        token
    }
}
// action types
export type RoomsActions = ReturnType<typeof loadedRoomInformation> | ReturnType<typeof successfullyUpdatedRoomConfiguration> | ReturnType<typeof loadedUserInRoom> | ReturnType<typeof loggedInSuccessInRoom>;