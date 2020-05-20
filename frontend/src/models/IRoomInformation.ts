export interface IRoomInformation{
    id:number,
    owenId:number,
    name:string,
    code:string,
    is_live: boolean,
    canModerate: boolean,
    canUploadFiles: boolean,
    questionLimit: number
}
export interface IRoomConfiguration{
    canModerate:boolean;
    canUploadFile: boolean;
    question_limit:number;
}