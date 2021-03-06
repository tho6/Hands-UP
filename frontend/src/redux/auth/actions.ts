export interface UserForm{
        id: number,
        name: string,
        email?: string,
        picture?: string
        guestId: number
}
export function loginSuccess(accessToken: string, refreshToken: string) {
    return {
        type: '@@AUTH/LOGIN_SUCCESS' as '@@AUTH/LOGIN_SUCCESS',
        accessToken,
        refreshToken
    }
}

export function loginFailed(message: string) {
    return {
        type: '@@AUTH/LOGIN_FAILED' as '@@AUTH/LOGIN_FAILED',
        message
    }
}

export function logout() {
    return {
        type: '@@AUTH/LOGOUT' as '@@AUTH/LOGOUT',
    }
}

export function resetLoginMessage(message: string) {
    return {
        type: '@@AUTH/RESET_LOGIN_MESSAGE' as '@@AUTH/RESET_LOGIN_MESSAGE'
    }
}

export function getPersonInfo(personInfo: UserForm) {
    return {
        type: '@@AUTH/GET_PERSON_INFO' as '@@AUTH/GET_PERSON_INFO',
        personInfo
    }
}
export function successfullyChangeGuestName(guestName: string) {
    return {
        type: '@@AUTH/EDIT_GUEST_NAME' as '@@AUTH/EDIT_GUEST_NAME',
        guestName
    }
}

export function getGuestIcon() {
    return {
        type: '@@AUTH/GET_GUEST_ICON' as '@@AUTH/GET_GUEST_ICON',
    }
}

// export function loginGoogle() {
//     return {
//         type: '@@AUTH/LOGIN_GOOGLE' as '@@AUTH/LOGIN_GOOGLE'
//     }
// }


export type AuthActions = ReturnType<typeof loginSuccess> | 
                            ReturnType<typeof logout> |
                            ReturnType<typeof loginFailed> |
                            ReturnType<typeof resetLoginMessage> |
                            ReturnType<typeof getPersonInfo> |
                            ReturnType<typeof successfullyChangeGuestName>| 
                            ReturnType<typeof getGuestIcon> 