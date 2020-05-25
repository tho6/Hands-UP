import { question } from "../type/question";
import { customFileDB } from "../type/questionFromDB";


export interface IQuestionService {
    getQuestionsByRoomId(meetingId: number): Promise<question[]>;
    updateQuestion(id: number, content: string, deleteFilesId: number[], files: string[]): Promise<{ files: customFileDB[], needApproved: boolean }>;
    createQuestion(meetingId: number, content: string, filesName: string[], platformId: number, guestId: null | number): Promise<question>;
    deleteQuestion(id: number): Promise<boolean>;
    addVote(questionId: number, guestId: number): Promise<boolean>;
    removeVote(questionId: number, guestId: number): Promise<boolean>;
    /* host */
    answeredQuestion(questionId: number): Promise<boolean>;
    hideOrApprovedQuestion(questionId: number, isHide:boolean): Promise<boolean>;
    /* Auth */
    getRoomHost(roomId: number): Promise<number>;
    getQuestionOwner(questionId: number): Promise<number>;
    /* reply */
    updateReply(id: number, content: string): Promise<boolean>;
    createReply(questionId: number, content: string, guestId: number): Promise<number>;
    deleteReply(id: number): Promise<boolean>;
    hideReply(replyId: number, isHide: boolean): Promise<boolean>;

}