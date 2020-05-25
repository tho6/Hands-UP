
export function SentFacebookCode(isSuccess:boolean) {
    return {
        type: "@@LIVE/SENT_FACEBOOK_CODE",
        isSuccess
    }
}

export type LiveActions = ReturnType<typeof SentFacebookCode>