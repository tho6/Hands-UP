export type questionDB = {
    questionId: number,
    guestId: number,
    guestName: string,
    content: string,
    meetingId: number,
    platformId: number,
    platformName: string,
    isHide: boolean,
    isAnswered: boolean,
    isApproved: boolean,
    createdAt: Date,
    updatedAt: Date
}
export type replyDB = {
    id: number,
    guestId: number,
    guestName: string,
    content: string,
    questionId: number,
    createdAt: Date,
    updatedAt: Date,
    isHide: boolean
}

export type customFileDB = { fileId: number, filename: string, questionId:number }

export type questionLiteDB = {
    content: string,
    questionId: number,
    deleteFilesId: number[],
    files: customFileDB[],
    updatedAt: number
}