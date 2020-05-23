import { questionDB, customFileDB } from "../type/questionFromDB";

export interface IQuestionDAO {
    getQuestionsByRoomId(meetingId: number): Promise<questionDB[]>;
    getQuestionLikes(meetingId: number): Promise<{guestId:number}[]>;
    getQuestionReplies(meetingId: number): Promise<questionDB[]>;
    getQuestionFiles(meetingId: number): Promise<customFileDB[]>;
    
    updateQuestion(id: number, content: string, deleteFilesId: number[], files: customFileDB[]): Promise<boolean>;
    createQuestion(questionerId: number, content: string, filesName: string[], isApproved: boolean): Promise<number>;
    deleteQuestion(id: number): Promise<boolean>;
    
    addVote(questionId: number): Promise<boolean>;
    removeVote(questionId: number): Promise<boolean>;
    /* host */
    answeredQuestion(questionId: number): Promise<boolean>;
    hideQuestion(questionId: number): Promise<boolean>;
    approvedQuestion(questionId: number): Promise<boolean>;
    /* Auth */
    checkIsHost(userId: number, meetingId: number): Promise<boolean>;
    checkIsOwner(guestId: number, questionId: number): Promise<boolean>;
}