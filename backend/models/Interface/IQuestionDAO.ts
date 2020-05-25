import { questionDB, customFileDB } from "../type/questionFromDB";
import { meetingConfig } from "../type/question";

export interface IQuestionDAO {
    getQuestionsByRoomId(meetingId: number): Promise<questionDB[]>;
    getQuestionLikes(questionId: number): Promise<number[]>;
    getQuestionFiles(questionId: number): Promise<customFileDB[]>;
    getQuestionById(questionId: number): Promise<questionDB>

    updateQuestion(id: number, content: string, deleteFilesId: number[], files: string[], isApproved:boolean): Promise<boolean>;
    createQuestion(meetingId: number, content: string, filesName: string[], isApproved: boolean, platformId:number, guestId:null|number): Promise<number>;
    deleteQuestion(id: number): Promise<boolean>;
    addVote(questionId: number, guestId:number): Promise<boolean>;
    removeVote(questionId: number, guestId:number): Promise<boolean>;
    /* host */
    answeredQuestion(questionId: number): Promise<boolean>;
    hideQuestion(questionId: number): Promise<boolean>;
    approvedQuestion(questionId: number): Promise<boolean>;
    /* Auth */
    getRoomHost(roomId:number): Promise<number>;
    getQuestionOwner(questionId: number): Promise<number>;
    /* get room config */
    getMeetingConfiguration(meetingId: number): Promise<meetingConfig>;
    getMeetingIdByQuestion(questionId: number): Promise<number>;
}