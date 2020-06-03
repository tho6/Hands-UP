import Knex from "knex";

export class ReportService {
    constructor(private knex: Knex){}

    //get Count question answered BY meetingId
    //get count question inappropriate By meetingId
    //egt view? from youtube and facebook and handsup -> create table first
    //get count questions from diff platform
    //question per person

    getViewsByMeetingId = async (meetingIds: number[]) => {
        try{
            if (meetingIds.length === 0) throw new RangeError("meetingId array is empty")
            if (meetingIds.some(id => id < 1)) throw new RangeError("meetingId array contain value smaller than 1");
            const result = await this.knex.raw(/*SQL*/`SELECT id, meeting_id as meetingId, youtube, facebook, handsup, created_at 
                                        FROM views WHERE meeting_id = ANY(?)
                                        ORDER BY meeting_id ASC,
                                                created_at ASC`, [meetingIds])
            return result.rows
        } catch (error) {
            console.log('[Report Service Error] ' + 'getViewsByMeetingId')
            throw error
        }
    }
    
    getQuestionReportDataByMeetingId = async (meetingIds: number[]) => {
        try{
            if (meetingIds.length === 0) throw new RangeError("meetingId array is empty")
            if (meetingIds.some(id => id < 1)) throw new RangeError("meetingId array contain value smaller than 1");
            const result = await this.knex.raw(/*SQL*/`SELECT 
                                        questions.id as id, questions.is_answered as isAnswered, 
                                        questions.guest_id as questionAskedById,
                                        questions.is_approved as isApproved, questions.is_hide as isHide,
                                        questions.created_at as questionCreatedAt, questions.content as questionContent,
                                        questions.meeting_id as meetingId, meetings.name as meetingName,
                                        meetings.date_time as meetingScheduleTime, meetings.created_at as meetingCreatedAt,
                                        meetings.updated_at as meetingUpdatedAt, questions.platform_id as platformId,
                                        platforms.name as platformName, meetings.owner_id as meetingOwnerId,
                                        users.name as meetingsOwnerName, q.likes as questionLikes
                                        FROM questions 
                                        LEFT JOIN platforms ON platforms.id = questions.platform_id
                                        LEFT JOIN meetings ON meetings.id = questions.meeting_id
                                        LEFT JOIN users ON meetings.owner_id = users.id
                                        LEFT JOIN (SELECT guests_questions_likes.question_id, count(*) as likes FROM guests_questions_likes GROUP BY guests_questions_likes.question_id) as q on q.question_id = questions.id


                                        WHERE questions.meeting_id =ANY(?) 
                                        ORDER BY questions.meeting_id ASC,
                                                questions.created_at ASC,
                                                questions.id ASC
                                                `,[meetingIds])
            return result.rows
        } catch (error) {
            console.log('[Report Service Error] ' + 'getQuestionReportDataByMeetingId')
            throw error
        }
    }

    getMeetingIdsById = async (id: number) => {
        try {
            const result = await this.knex.raw(/*SQL*/`SELECT id from meetings WHERE owner_id = (?)`, [id])
            return result.rows
        } catch (error) {
            console.log('[Report Service Error] ' + 'getMeetingIdsById')
            throw error
        }
    }

}