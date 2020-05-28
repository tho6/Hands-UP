export type questionDB = {
    id: number,
    guestId: number|null,
    guestName: string|null,
    content: string,
    meetingId: number,
    platformId: number,
    platformName: string,
    isHide: boolean,
    isAnswered: boolean,
    isApproved: boolean,
    createdAt: Date,
    updatedAt: Date,
    platformUsername:string
}
export type customFileDB = { id: number, filename: string}

export type questionLiteDB = {
    content: string,
    questionId: number,
    deleteFilesId: number[],
    files: customFileDB[],
    updatedAt: number
}