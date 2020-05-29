import Knex from "knex";

export class ReportService {
    constructor(private knex: Knex){}

    //get Count question answered BY meetingId
    //get count question inappropriate By meetingId
    //egt view? from youtube and facebook and handsup -> create table first
    //get count questions from diff platform
    //question per person

    getViewsByMeetingId = async (meetingId: number[]) => {
        try{
            if (meetingId.length === 0) throw new RangeError("meetingId array is empty")
            if (meetingId.some(id => id < 1)) throw new RangeError("meetingId array contain value smaller than 1");
            const result = await this.knex.raw(/*SQL*/`SELECT meeting_id, youtube, facebook, handsup, created_at 
                                        FROM views WHERE meeting_id = ANY(?)
                                        ORDER BY meeting_id ASC,
                                                created_at ASC`, [meetingId])
            return result.rows
        } catch (error) {
            console.log('[Report Service Error] ' + 'getViewsByMeetingId')
            throw error
        }
    }
    

}