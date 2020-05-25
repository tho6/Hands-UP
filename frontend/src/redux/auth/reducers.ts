import { AuthActions } from "./actions";

export interface AuthState{
    accessToken: string | null | undefined
    refreshToken: string | null | undefined
    personInfo: PersonInfo | null
    isAuthenticated: boolean | null
    message: string | null
}

export interface PersonInfo{
    userId?: number
    guestId: number
    picture?: string
    userName?: string
    guestName: string
    email?: string
}

const initialState: AuthState = {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    personInfo: null,
    isAuthenticated: null,
    message: null
}

export const authReducer = (state:AuthState = initialState, action: AuthActions): AuthState => {
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
            return{
                ...state,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                personInfo: null,
                message: action.message
            }
        case '@@AUTH/RESET_LOGIN_MESSAGE':
            return{
                ...state,
                message: null
            }
        case '@@AUTH/GET_PERSON_INFO':
            return{
                ...state,
                personInfo: action.personInfo
            }
        default:
            return state
    }
}