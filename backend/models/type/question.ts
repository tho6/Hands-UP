export type question = {
    id: number,
    questioner: questioner,
    content: string,
    likes: number[],
    replies: reply[],
    files: customFile[],
    meetingId: number,
    platformId: number,
    isHide: boolean,
    isAnswered: boolean,
    isApproved: boolean,
    createdAt: number,
    updatedAt: number
}

type questioner = {
    name: string,
    id: number
}

export type reply = {
    id: number,
    guestId: number,
    guestName: string,
    content: string,
    questionId: number,
    isEdit: boolean,
    createdAt: number,
    updatedAt: number,
    isHide: boolean
}

export type customFile = { id: number, filename: string }

export type questionLite = {
    content: string,
    questionId: number,
    deleteFilesId: number[],
    files: customFile[],
    updatedAt: number
}