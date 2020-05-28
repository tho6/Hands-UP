import { question } from "../type/question";
import { customFileDB } from "../type/questionFromDB";
import { replyDB } from "../type/replyFromDB";


export interface IQuestionService {
    getQuestionsByRoomId(meetingId: number): Promise<question[]>;
    updateQuestion(id: number, content: string, deleteFilesId: number[], files: string[]): Promise<{ files: customFileDB[], needApproved: boolean }>;
    createQuestion(meetingId: number, content: string, filesName: string[], platformId: number, guestId: null | number): Promise<question>;
    createQuestionFromPlatform(meetingId: number, content: string, platformId: number, platformName:string): Promise<question>
    deleteQuestion(id: number): Promise<boolean>;
    addVote(questionId: number, guestId: number): Promise<boolean>;
    removeVote(questionId: number, guestId: number): Promise<boolean>;
    /* host */
    answeredQuestion(questionId: number): Promise<boolean>;
    hideOrApprovedQuestion(questionId: number, isHide:boolean): Promise<boolean>;
    /* Auth */
    getRoomHost(questionId: number): Promise<number>;
    getRoomIdByQuestionId(questionId: number): Promise<number>;
    getRoomIdByReplyId(replyId: number): Promise<number>;
    getRoomHostByMeetingId(meetingId: number): Promise<number>;
    getQuestionOwner(questionId: number): Promise<number>;
    /* reply */
    updateReply(id: number, content: string): Promise<boolean>;
    createReply(questionId: number, content: string, guestId: number): Promise<replyDB>;
    deleteReply(id: number): Promise<boolean>;
    hideReply(replyId: number, isHide: boolean): Promise<boolean>;
    getReplyOwner(replyId: number): Promise<number>;
    getQuestionIdByReplyId(replyId: number): Promise<number>
}