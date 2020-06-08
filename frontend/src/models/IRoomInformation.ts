import { IGuest } from "./IUserQ";

export interface IRoomInformation{
    id:number,
    ownerId:number,
    name:string,
    code:string,
    is_live: boolean,
    canModerate: boolean,
    canUploadFile: boolean,
    questionLimit: number,
    url: string,
    createdAt: Date,
    updatedAt: Date,
    dateTime: Date,
}
export interface IRoomConfiguration{
    canModerate:boolean;
    canUploadFile: boolean;
    questionLimit:number;
}