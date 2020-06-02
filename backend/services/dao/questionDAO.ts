import Knex from "knex";
import { IQuestionDAO } from "../../models/Interface/IQuestionDAO";
import { questionDB, customFileDB } from "../../models/type/questionFromDB"
import { meetingConfig } from "../../models/type/question";

export class QuestionDAO implements IQuestionDAO {
    //private dataset: Comment;
    constructor(private knex: Knex) { }
    async getQuestionsByRoomId(meetingId: number): Promise<questionDB[]> {
        const sql = `SELECT questions.id as "id",guest_id as "guestId",guests.name as "guestName", content, meeting_id as "meetingId", is_hide as "isHide", is_answered as "isAnswered", is_approved as "isApproved", questions.created_at as "createdAt", questions.updated_at as "updatedAt", platform_id as "platformId", platforms.name as "platformName", platform_username as "platformUsername" FROM questions LEFT JOIN guests ON questions.guest_id = guests.id INNER JOIN platforms ON questions.platform_id = platforms.id WHERE meeting_id = ?;`;
        const result = await this.knex.raw(sql, [meetingId]);
        return result.rows;
    }
    async getQuestionLikes(questionId: number): Promise<number[]> {
        const sql = `SELECT guest_id as "guestId" FROM guests_questions_likes where question_id = ?;`;
        const result = await this.knex.raw(sql, [questionId]);
        const returnValue = result.rows.map((elem: { guestId: number }) => elem.guestId);
        return returnValue;
    }
    async getQuestionFiles(questionId: number): Promise<customFileDB[]> {
        const sql = `SELECT id, name as "filename" FROM question_attachments where question_id = ?;`;
        const result = await this.knex.raw(sql, [questionId]);
        return result.rows;
    }
    async updateQuestion(id: number, content: string, deleteFilesId: number[], files: string[], isApproved: boolean): Promise<boolean> {
        const updateContent = `UPDATE questions SET (content, updated_at, is_approved) = (?, NOW(), ?) WHERE id = ?;`;
        const insertFiles = `INSERT INTO question_attachments (question_id, name) VALUES (?, ?);`;
        const deleteFiles = `DELETE FROM question_attachments WHERE id = ANY (?);`;
        const trx = await this.knex.transaction();
        try {
            const updateResult = await trx.raw(updateContent, [content, isApproved, id]);
            if (updateResult.rowCount !== 1) {
                throw new Error('Fail to update question - content');
            }
            for (const file of files) {
                const insertFileResult = await trx.raw(insertFiles, [id, file]);
                if (insertFileResult.rowCount !== 1) {
                    throw new Error('Fail to update question - insert files');
                }
            }
           if(deleteFilesId.length>0) {
                const deleteFileResult = await trx.raw(deleteFiles, [deleteFilesId]);
                if (deleteFileResult.rowCount !== deleteFilesId.length) throw new Error('Fail to update question - delete files');
            }
            await trx.commit();
            return true;
        } catch (e) {
            await trx.rollback();
            throw e;
        }
    }
    async createQuestion(meetingId: number, content: string, filesName: string[], isApproved: boolean, platformId: number, guestId: null | number): Promise<number> {
        const trx = await this.knex.transaction();
        let insertId:number = 0;
        try {
            if (guestId) {
                const sql = `INSERT INTO questions (content, is_answered, is_approved, is_hide, meeting_id, platform_id, guest_id) VALUES ( ?, ?, ?, ?, ?, ?, ?) RETURNING id;`;
                const result = await trx.raw(sql, [content, false, isApproved, false, meetingId, platformId, guestId]);
                insertId = parseInt(result.rows[0].id);
            } else {
                const sql = `INSERT INTO questions (content, is_answered, is_approved, is_hide, meeting_id, platform_id, guest_id) VALUES ( ?, ?, ?, ?, ?, ?, null) RETURNING id;`;
                const result = await trx.raw(sql, [content, false, isApproved, false, meetingId, platformId]);
                insertId = parseInt(result.rows[0].id);
            }
            if(!insertId) {
                throw new Error('Fail to create question - insert question fail');
            }
            for(const file of filesName){
                const sql = `INSERT INTO question_attachments (question_id, name) VALUES (?, ?);`;
                const result = await trx.raw(sql, [insertId, file]);
                if(result.rowCount!==1){
                    throw new Error('Fail to create question - insert files fail');
                }
            }
            await trx.commit();
            return insertId;
         } catch (e) {
            await trx.rollback();
            throw e;
        }
    }
    async createQuestionFromPlatform(meetingId: number, content: string, platformId: number, platformUsername:string): Promise<number> {
        const trx = await this.knex.transaction();
        let insertId:number = 0;
        try {
                const sql = `INSERT INTO questions (content, is_answered, is_approved, is_hide, meeting_id, platform_id, platform_username) VALUES ( ?, ?, ?, ?, ?, ?, ?) RETURNING id;`;
                const result = await trx.raw(sql, [content, false, true, false, meetingId, platformId, platformUsername]);
                insertId = parseInt(result.rows[0].id);
            if(!insertId) {
                throw new Error('Fail to create question - insert question fail');
            }
            await trx.commit();
            return insertId;
         } catch (e) {
            await trx.rollback();
            throw e;
        }
    }
    async deleteQuestion(id: number): Promise<boolean> {
        const sql = `DELETE FROM questions WHERE id = ?;`;
        const result  = await this.knex.raw(sql, [id]);
        if (result.rowCount !== 1){
            throw new Error('Fail to deleteQuestion, question is not found!')
        }
        return true;
    }
    async addVote(questionId: number, guestId:number): Promise<boolean> {
        const sql = `INSERT INTO guests_questions_likes (guest_id, question_id) VALUES (?, ?);`;
        const result = await this.knex.raw(sql, [guestId, questionId]);
        if(result.rowCount!==1){
            throw new Error('Fail to addVote!')
        }
        return true;
    }
    async removeVote(questionId: number, guestId:number): Promise<boolean> {
        const sql = `DELETE FROM guests_questions_likes WHERE guest_id = ? AND question_id = ?;`;
        const result = await this.knex.raw(sql, [guestId, questionId]);
        if(result.rowCount!==1){
            throw new Error('Fail to removeVote!')
        }
        return true;
    }
    async answeredQuestion(questionId: number): Promise<boolean> {
        const sql = `UPDATE questions SET is_answered = true WHERE id = ?;`;
        const result = await this.knex.raw(sql, [questionId]);
        if(result.rowCount!==1){
            throw new Error('Fail to answer question - question is not found!')
        }
        return true;
    }
    async hideQuestion(questionId: number): Promise<boolean> {
        const sql = `UPDATE questions SET (is_hide, is_approved) = (true, false) WHERE id = ?;`;
        const result = await this.knex.raw(sql, [questionId]);
        if(result.rowCount!==1){
            throw new Error('Fail to hide question - question is not found!')
        }
        return true;
    }
    async approvedQuestion(questionId: number): Promise<boolean> {
        const sql = `UPDATE questions SET (is_hide, is_approved) = (false, true) WHERE id = ?;`;
        const result = await this.knex.raw(sql, [questionId]);
        if(result.rowCount!==1){
            throw new Error('Fail to approve question - question is not found!')
        }
        return true;
    }
    async getRoomHost(roomId: number): Promise<number> {
        const sql = `SELECT owner_id as "ownerId" FROM meetings WHERE id = ?;`;
        const result = await this.knex.raw(sql, [roomId]);
        if(result.rows.length !== 1){
                throw new Error('Fail to getHost - room is not found!')
        }
        return result.rows[0].ownerId;
    }
    async getQuestionOwner(questionId: number): Promise<number> {
        const sql = `SELECT guest_id as "guestId" FROM questions WHERE id = ?;`;
        const result = await this.knex.raw(sql, [questionId]);
        if(result.rows.length !== 1){
            throw new Error('Fail to get question owner - question is not found!')
    }
        return result.rows[0].guestId;
    }
    async getMeetingConfiguration(meetingId: number): Promise<meetingConfig> {
        const sql = `SELECT is_live as "isLive", can_moderate as "canModerate", can_upload_file as "canUploadFile", question_limit as "questionLimit" FROM meetings WHERE id = ?;`;
        const result = await this.knex.raw(sql, [meetingId]);
        if(result.rows.length !== 1){
            throw new Error('Fail to get meeting configuration - meeting is not found!')
    }
        return result.rows[0];
    }
    async getMeetingIdByQuestion(questionId: number): Promise<number> {
        const sql = `SELECT meeting_id as "meetingId" FROM questions WHERE id = ?;`;
        const result = await this.knex.raw(sql, [questionId]);
        if(result.rows.length !== 1){
            throw new Error('Fail to get meeting Id by question - question is not found!')
    }
        return result.rows[0].meetingId;
    }
    async getQuestionById(questionId: number): Promise<questionDB> {
        const sql = `SELECT questions.id as "id",guest_id as "guestId",guests.name as "guestName", content, meeting_id as "meetingId", is_hide as "isHide", is_answered as "isAnswered", is_approved as "isApproved", questions.created_at as "createdAt", questions.updated_at as "updatedAt", platform_id as "platformId", platforms.name as "platformName", platform_username as "platformUsername" FROM questions LEFT JOIN guests ON questions.guest_id = guests.id INNER JOIN platforms ON questions.platform_id = platforms.id WHERE questions.id = ?;`;
        const result = await this.knex.raw(sql, [questionId]);
        if(result.rows.length !== 1){
            throw new Error('Fail to get question by questionId - question is not found!')
    }
        return result.rows[0];
    }
}
