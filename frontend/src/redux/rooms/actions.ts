import { IRoomInformation, IRoomConfiguration } from "../../models/IRoomInformation";

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
// export function updateHostList(meetingId:number) {
//     return {
//         type: '@@ROOMS/UPDATE_HOST_LIST' as '@@ROOMS/UPDATE_HOST_LIST',
//         user,
//         meetingId
//     }
// }
export function loggedInSuccessInRoom(token: string) {
    return {
        type: '@@ROOMS/LOGGED_IN_SUCCESS' as '@@ROOMS/LOGGED_IN_SUCCESS',
        token
    }
}
export function setQuestionLimitState(meetingId: number, isChecking: boolean) {
    return {
        type: '@@ROOMS/SET_STATUS_OF_QUESTION_LIMIT' as '@@ROOMS/SET_STATUS_OF_QUESTION_LIMIT',
        isChecking,
        meetingId
    }
}
export function successfullyToggleYoutubeLiveStatus(meetingId: number, isFetch: boolean) {
    return {
        type: '@@ROOMS/TOGGLE_YOUTUBE_LIVE_STATUS' as '@@ROOMS/TOGGLE_YOUTUBE_LIVE_STATUS',
        isFetch,
        meetingId
    }
}
export function successfullyToggleFacebookLiveStatus(meetingId: number, isFetch: boolean|null) {
    return {
        type: '@@ROOMS/TOGGLE_FACEBOOK_LIVE_STATUS' as '@@ROOMS/TOGGLE_FACEBOOK_LIVE_STATUS',
        isFetch,
        meetingId
    }
}
export function loadInitialLiveStatus(meetingId: number, facebook: boolean|null, youtube: boolean) {
    return {
        type: '@@ROOMS/LOAD_INITIAL_LIVE_STATUS' as '@@ROOMS/LOAD_INITIAL_LIVE_STATUS',
        facebook,
        youtube,
        meetingId
    }
}
export function message(status: boolean, message: string, redirect?:string) {
    return {
        type: '@@ROOMS/MESSAGE' as '@@ROOMS/MESSAGE',
        status,
        message,
        redirect
    }
}
export function googlePermissionModal(isShow: boolean) {
    return {
        type: '@@ROOMS/GOOGLE_PERMISSION_MODAL' as '@@ROOMS/GOOGLE_PERMISSION_MODAL',
        isShow,
    }
}
// action types
export type RoomsActions = ReturnType<typeof loadedRoomInformation> | ReturnType<typeof successfullyUpdatedRoomConfiguration> | ReturnType<typeof loggedInSuccessInRoom> | ReturnType<typeof setQuestionLimitState>
    | ReturnType<typeof successfullyToggleYoutubeLiveStatus> | ReturnType<typeof loadInitialLiveStatus> | ReturnType<typeof successfullyToggleFacebookLiveStatus> | ReturnType<typeof message> | ReturnType<typeof googlePermissionModal>;