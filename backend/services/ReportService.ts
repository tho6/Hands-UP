import Knex from "knex";
import { reportDataQuestionsBasic, reportDataQuestionsBasicWithMeetingName, questionsCountOfLatestMeetings } from "../models/type/reportData";

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

    getAllQuestions = async ():Promise<reportDataQuestionsBasicWithMeetingName[]> =>{
        const sql = `SELECT questions.id as "questionId", name as "meetingName", is_answered as "isAnswered", is_approved as "isApproved", is_hide as "isHide", meeting_id as "meetingId", platform_id as "platformId" FROM  questions;`;
        const result = await this.knex.raw(sql);
        return result.rows
    }
    getQuestionsOfLatestXMeetings = async (numberOfMeetings:number):Promise<reportDataQuestionsBasic[]> =>{
        const sql = `SELECT is_answered as "isAnswered", is_approved as "isApproved", is_hide as "isHide", meeting_id as "meetingId", platform_id as "platformId" FROM  questions WHERE meeting_id IN (SELECT id from meetings ORDER BY id DESC LIMIT ?);`;
        const result = await this.knex.raw(sql, numberOfMeetings);
        return result.rows
    }
    getQuestionsCountOfLatestXMeetings = async (numberOfMeetings:number, userId:number):Promise<questionsCountOfLatestMeetings[]> =>{
        const sql = `SELECT name as "meetingName",meeting_id as "meetingId", COUNT(meeting_id) FROM  questions INNER JOIN meetings ON questions.meeting_id = meetings.id WHERE owner_id = ? AND meeting_id IN (SELECT id from meetings ORDER BY id DESC LIMIT  ? ) GROUP BY meeting_id, meetings.name;`;
        const result = await this.knex.raw(sql, [userId, numberOfMeetings]);
        return result.rows
    }
}