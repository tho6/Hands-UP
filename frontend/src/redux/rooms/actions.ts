import { IRoomInformation, IRoomConfiguration } from "../../models/IRoomInformation";
import { IGuest } from "../../models/IUserQ";

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
export function loadedUserInRoom(user: IGuest, meetingId:number) {
    return {
        type: '@@ROOMS/LOADED_USER' as '@@ROOMS/LOADED_USER',
        user,
        meetingId
    }
}
export function loggedInSuccessInRoom(token: string) {
    return {
        type: '@@ROOMS/LOGGED_IN_SUCCESS' as '@@ROOMS/LOGGED_IN_SUCCESS',
        token
    }
}
export function setQuestionLimitState(meetingId:number, isChecking: boolean) {
    return {
        type: '@@ROOMS/SET_STATUS_OF_QUESTION_LIMIT' as '@@ROOMS/SET_STATUS_OF_QUESTION_LIMIT',
        isChecking,
        meetingId
    }
}
export function successfullyToggleYoutubeLiveStatus(meetingId:number, isFetch: boolean) {
    return {
        type: '@@ROOMS/TOGGLE_YOUTUBE_LIVE_STATUS' as '@@ROOMS/TOGGLE_YOUTUBE_LIVE_STATUS',
        isFetch,
        meetingId
    }
}
// action types
export type RoomsActions = ReturnType<typeof loadedRoomInformation> | ReturnType<typeof successfullyUpdatedRoomConfiguration> | ReturnType<typeof loadedUserInRoom> | ReturnType<typeof loggedInSuccessInRoom>| ReturnType<typeof setQuestionLimitState>
|ReturnType<typeof successfullyToggleYoutubeLiveStatus>;