import { AuthActions } from "./actions";
import faker from 'faker'
export interface AuthState {
    accessToken: string | null | undefined
    refreshToken: string | null | undefined
    personInfo: PersonInfo | null
    isAuthenticated: boolean | null
    message: string | null
}

export interface PersonInfo {
    userId?: number | null
    guestId: number
    picture?: string | null
    userName?: string | null
    guestName: string
    email?: string | null
}

const initialState: AuthState = {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    personInfo: {picture:`/icon/${Math.floor(Math.random() * 15) + 1 }.jpg`} as PersonInfo,
    isAuthenticated: null,
    message: null
}

export const authReducer = (state: AuthState = initialState, action: AuthActions): AuthState => {
    switch (action.type) {
        case '@@AUTH/LOGIN_SUCCESS':
            return {
                ...state,
                accessToken: action.accessToken,
                refreshToken: action.refreshToken,
                isAuthenticated: true
            }
        case '@@AUTH/LOGOUT':
            return {
                ...state,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                personInfo: null
            }
        case '@@AUTH/LOGIN_FAILED':
            return {
                ...state,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                personInfo: null,
                message: action.message
            }
        case '@@AUTH/RESET_LOGIN_MESSAGE':
            return {
                ...state,
                message: null
            }
        case '@@AUTH/GET_PERSON_INFO':
            const newPeronInfo: PersonInfo = { ...state.personInfo } as PersonInfo
            if (action.personInfo.hasOwnProperty('email')) {
                newPeronInfo['userId'] = action.personInfo.id
                newPeronInfo['email'] = action.personInfo.email
                newPeronInfo['picture'] = action.personInfo.picture
                newPeronInfo['userName'] = action.personInfo.name
                newPeronInfo['guestId'] = action.personInfo.guestId
            } else {
                newPeronInfo['userId'] = null
                newPeronInfo['email'] = null
                newPeronInfo['userName'] = null
                newPeronInfo['guestId'] = action.personInfo.id
                newPeronInfo['userName'] = action.personInfo.name
            }
            return {
                ...state,
                personInfo: newPeronInfo,
                isAuthenticated:true
            }
        case '@@AUTH/EDIT_GUEST_NAME':
            return {
                ...state,
                personInfo: {...state.personInfo, userName:action.guestName} as PersonInfo
            }
        case '@@AUTH/GET_GUEST_ICON':
            return {...state, personInfo:{...state.personInfo, picture:`/icon/${Math.floor(Math.random() * 15) + 1 }.jpg`} as PersonInfo}
        default:
            return state
    }
}