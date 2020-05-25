export interface IQuestion {
    id: number;
    questioner: questioner
    content: string;
    likes: number[];
    files: file[];
    replies: reply[];
    meetingId: number;
    isApproved: boolean;
    isHide: boolean;
    isAnswered: boolean;
    updatedAt:Date;
    createdAt:Date;
    platform: platform
}
export type reply = {
    id: number;
    guestId: number;
    guestName: string;
    content: string;
    questionId: number;
    createdAt:Date;
    updatedAt:Date;
    isHide: boolean;

}
export type file = {
    id: number;
    filename: string;
}
export type questioner = {
    id: number;
    name: string;
}
export type platform={
    id:number;
    name:string
}
