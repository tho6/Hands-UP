export type question = {
    id: number,
    questioner: questioner,
    content: string,
    likes: number[],
    replies: reply[],
    files: customFile[],
    meetingId: number,
    platform: platform,
    isHide: boolean,
    isAnswered: boolean,
    isApproved: boolean,
    createdAt: Date,
    updatedAt: Date
}

type questioner = {
    name: string | null,
    id: number | null
}
export type meetingConfig = {
    isLive: boolean,
    canModerate: boolean,
    canUploadFile: boolean,
    questionLimit: number
}
export type reply = {
    id: number,
    guestId: number,
    guestName: string,
    content: string,
    questionId: number,
    createdAt: Date,
    updatedAt: Date,
    isHide: boolean
}
export type platform = {
    id: number;
    name: string
}

export type customFile = { id: number, filename: string }

export type questionLite = {
    content: string,
    questionId: number,
    deleteFilesId: number[],
    files: customFile[],
    updatedAt: number
}