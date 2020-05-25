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