export interface IQuestion {
    id: number;
    questioner: questioner
    content: string;
    likes: number[];
    files: file[];
    replies: reply[];
    isEdit: boolean;
    meetingId: number;
    isModerate: boolean;
    isHide: boolean;
    isAnswered: boolean;
    updatedAt:Date;
    createdAt:Date;
}
export type reply = {
    id: number;
    guestId: number;
    guestName: string;
    content: string;
    questionId: number;
    isEdit: boolean;

}
export type file = {
    id: number;
    filename: string;
}
export type questioner = {
    id: number;
    name: string;
}
