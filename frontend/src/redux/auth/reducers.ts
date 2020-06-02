import { AuthActions } from "./actions";
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
    personInfo: null,
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

            } else {
                newPeronInfo['userId'] = null
                newPeronInfo['email'] = null
                newPeronInfo['picture'] = '/icon/1.jpg'
                newPeronInfo['userName'] = null
                newPeronInfo['guestId'] = action.personInfo.id
                newPeronInfo['userName'] = action.personInfo.name
            }
            return {
                ...state,
                personInfo: newPeronInfo
            }
        default:
            return state
    }
}