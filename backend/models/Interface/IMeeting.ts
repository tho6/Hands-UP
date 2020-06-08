export interface IMeeting {
    id: number;
    owner_id: number;
    name: string;
    code: string;
    url: string;
    is_live: boolean;
    created_at: Date,
    updated_at: Date
    date_time: Date;
    can_moderate: boolean;
    can_upload_file: boolean;
    question_limit: number;
}
export interface IRoomConfiguration{
    canModerate:boolean;
    canUploadFile: boolean;
    questionLimit:number;
}