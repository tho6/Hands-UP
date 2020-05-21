import { IGuest } from "./IUserQ";

export interface IRoomInformation{
    id:number,
    owenId:number,
    name:string,
    code:string,
    is_live: boolean,
    canModerate: boolean,
    canUploadFiles: boolean,
    questionLimit: number,
    userInformation?: IGuest|null
}
export interface IRoomConfiguration{
    canModerate:boolean;
    canUploadFile: boolean;
    question_limit:number;
}