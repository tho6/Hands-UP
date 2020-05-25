import { replyDB } from "../type/replyFromDB";

export interface IReplyDAO {
    getQuestionReplies(questionId: number): Promise<replyDB[]>;
    getReplyById(replyId: number): Promise<replyDB>
    getRoomIdByReplyId(replyId: number): Promise<number>
    updateReply(id: number, content: string): Promise<boolean>;
    createReply(questionId: number, content: string, guestId:number): Promise<number>;
    deleteReply(id: number): Promise<boolean>;
    /* host */
    hideReply(replyId: number, isHide:boolean): Promise<boolean>;
    /* Auth */
    getReplyOwner(replyId: number): Promise<number>;
}