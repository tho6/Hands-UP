export interface IReportQuestion{
    id: number,
    isanswered: boolean,
    questionaskedbyid: number,
    isapproved: boolean,
    ishide: boolean,
    questioncreatedat: Date,
    meetingid: number,
    meetingname: string,
    meetingscheduletime: Date,
    meetingcreatedat: Date,
    meetingupdatedat: Date,
    platformid: number,
    platformname: string,
    meetingownerid: number,
    meetingsownername: string,
    questionlikes: string | null
    questioncontent: string
}

export interface IReportView{
    id: number,
    meetingid: number,
    youtube: number,
    facebook: number,
    handsup: number,
    created_at: Date

}