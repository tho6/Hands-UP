export type reportDataQuestionsBasic = {
    isAnswered: boolean,
    isApproved:boolean,
    isHide:boolean,
    meetingId: number, 
    platformId: number
}
export type questionsCountOfLatestMeetings = {
    meetingId:number,
    meetingName:string,
    count:number
}
export type reportDataQuestionsBasicWithMeetingName = {
    meetingName:string,
    isAnswered: boolean,
    isApproved:boolean,
    isHide:boolean,
    meetingId: number, 
    questionId: number, 
    platformId: number
}