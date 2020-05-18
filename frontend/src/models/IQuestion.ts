export interface IQuestion {
    id:number;
    questioner:questioner
    content: string;
    likes: number;
    files: file[];
    replies:reply[];
    updatedAt:Date;
    createdAt:Date;
    meetingId: number;
    isModerate:boolean;
    isHide:boolean;
    isAnswered: boolean;
}
export type reply = {
    id: number;
    guestId:number;
    guestName: string;
    content:string;
}
export type file = {
    id: number;
    filename:string;
}
export type questioner = {
    id:number;
    name:string;
}