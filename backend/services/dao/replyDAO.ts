import Knex from "knex";
import { IReplyDAO } from "../../models/Interface/IReplyDAO";
import { replyDB } from "../../models/type/replyFromDB"

export class ReplyDAO implements IReplyDAO {
    constructor(private knex: Knex) { }
    async getQuestionReplies(questionId: number): Promise<replyDB[]> {
        const sql = `SELECT replies.id, replies.guest_id as "guestId", guests.name as "guestName", content, question_id as "questionId", replies.created_at as "createdAt", replies.updated_at as "updatedAt", is_hide as "isHide" FROM replies INNER JOIN guests ON replies.guest_id = guests.id WHERE question_id = ?;`;
        const result = await this.knex.raw(sql, [questionId]);
        return result.rows;
    }
    async updateReply(id: number, content: string): Promise<boolean> {
        const sql = `UPDATE replies SET (content, updated_at) = (?, NOW()) where id = ?;`;
        const result = await this.knex.raw(sql,[content, id]);
        if(result.rowCount!==1){
            throw new Error('Fail tp update reply - reply is not found!')
        }
        return true;
    }
    async createReply(questionId: number, content: string, guestId: number): Promise<number> {
        const sql = `INSERT INTO replies (content, question_id, guest_id, is_hide) VALUES (?, ?, ?, ?) RETURNING id;`;
        const result = await this.knex.raw(sql, [content, questionId, guestId, false]);
        return result.rows[0].id;
    }
    async deleteReply(id: number): Promise<boolean> {
       const sql = `DELETE FROM replies WHERE id = ?;`;
       const result = await this.knex.raw(sql, [id])
       if(result.rowCount !==1){
           throw new Error('Fail to delete reply - reply is not found!')
       }
       return true;
    }
    async hideReply(replyId: number, isHide: boolean): Promise<boolean> {
        const sql = `UPDATE replies SET is_hide = ? where id = ?;`;
        const result = await this.knex.raw(sql,[isHide, replyId])
        if(result.rowCount !== 1){
            throw new Error('Fail to hide reply - reply is not found!');
        }
        return true;
    }
    async getReplyOwner(replyId: number): Promise<number> {
        const sql = `SELECT guest_id as "guestId" FROM replies WHERE id = ?;`;
        const result = await this.knex.raw(sql, [replyId]);
        if(result.rowCount !== 1){
            throw new Error('Fail to get reply owner - reply is not found');
        }
        return result.rows[0].guestId;
    }

}