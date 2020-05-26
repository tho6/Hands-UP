// import fs from 'fs';
// import path from 'path';
import { IQuestionService } from "../models/Interface/IQuestionService";
import { IQuestionDAO } from "../models/Interface/IQuestionDAO";
import { IReplyDAO } from "../models/Interface/IReplyDAO";
import { question } from '../models/type/question';
import { customFileDB, questionDB } from '../models/type/questionFromDB';
import { replyDB } from '../models/type/replyFromDB';

export class QuestionService implements IQuestionService {
    //private dataset: Comment;
    constructor(private questionDAO: IQuestionDAO, private replyDAO: IReplyDAO) { }
    async getQuestionsByRoomId(meetingId: number): Promise<question[]> {
        const questionFromDB: questionDB[] = await this.questionDAO.getQuestionsByRoomId(meetingId);
        const questions = await this.buildQuestion(questionFromDB);
        return questions;
    }
    async updateQuestion(id: number, content: string, deleteFilesId: number[], files: string[]): Promise<{ files: customFileDB[]; needApproved: boolean; }> {
        const meetingId = await this.questionDAO.getMeetingIdByQuestion(id);
        const roomConfig = await this.questionDAO.getMeetingConfiguration(meetingId);
        if (!roomConfig.canUploadFile && files.length > 0) throw new Error('This room is not allowed to upload any files!');
        if (files.length > 3) throw new Error('You are not allowed to upload more than 3 images!');
        if (files.length > 0 || deleteFilesId.length > 0) {
            const copyOfDeleteFilesId = deleteFilesId.slice();
            const existingFiles = await this.questionDAO.getQuestionFiles(id);
            const existingFilesId = existingFiles.map(file => file.id);
            const arrayToCheckAllTrue = copyOfDeleteFilesId.map(id => existingFilesId.includes(id));
            const notValid = arrayToCheckAllTrue.includes(false);
            if (notValid) throw new Error('You cannot delete files from other questions!');
            if ((existingFiles.length + files.length - deleteFilesId.length) > 3) throw new Error('No more than 3 images for each question!');
        }
        const isApproved = roomConfig.canModerate && files.length > 0 ? false : true;
        const isUpdated = await this.questionDAO.updateQuestion(id, content, deleteFilesId, files, isApproved);
        if (!isUpdated) throw new Error('updateQuestion - unknown error');
        const existingFilesAfterUpdate = await this.questionDAO.getQuestionFiles(id);
        return { files: existingFilesAfterUpdate, needApproved: !isApproved };
    }
    async createQuestion(meetingId: number, content: string, filesName: string[], platformId: number, guestId: number | null): Promise<question> {
        const roomConfig = await this.questionDAO.getMeetingConfiguration(meetingId);
        if (!roomConfig.canUploadFile && filesName.length > 0) throw new Error('This room is not allowed to upload any files!');
        if (filesName.length > 3) throw new Error('You are not allowed to upload more than 3 images!');
        const isApproved = roomConfig.canModerate && filesName.length > 0 ? false : true;
        const insertId = await this.questionDAO.createQuestion(meetingId, content, filesName, isApproved, platformId, guestId);
        const question = await this.questionDAO.getQuestionById(insertId);
        const result = await this.buildQuestion([question]);
        return result[0];
    }
    async deleteQuestion(id: number): Promise<boolean> {
        const isDeleted = await this.questionDAO.deleteQuestion(id);
        if (!isDeleted) throw new Error('Fail to delete question - unknown error!');
        return isDeleted;
    }
    async addVote(questionId: number, guestId: number): Promise<boolean> {
        const isAdded = await this.questionDAO.addVote(questionId, guestId);
        if (!isAdded) throw new Error('Fail to add vote - unknown error!');
        return isAdded;
    }
    async removeVote(questionId: number, guestId: number): Promise<boolean> {
        const isRemoved = await this.questionDAO.removeVote(questionId, guestId);
        if (!isRemoved) throw new Error('Fail to remove vote - unknown error!');
        return isRemoved;
    }
    async answeredQuestion(questionId: number): Promise<boolean> {
        const isAnsweredQuestion = await this.questionDAO.answeredQuestion(questionId);
        if (!isAnsweredQuestion) throw new Error('Fail to answer question - unknown error!');
        return isAnsweredQuestion;
    }
    async hideOrApprovedQuestion(questionId: number, isHide: boolean): Promise<boolean> {
        if (isHide) {
            const hided = await this.questionDAO.hideQuestion(questionId);
            if (!hided) throw new Error('Fail to hide question - unknown error');
            return hided;
        } else {
            const approved = await this.questionDAO.approvedQuestion(questionId);
            if (!approved) throw new Error('Fail to approve question - unknown error');
            return approved;
        }
    }
    async getRoomHost(questionId: number): Promise<number> {
        const roomId = await this.questionDAO.getMeetingIdByQuestion(questionId);
        const hostId = await this.questionDAO.getRoomHost(roomId);
        return hostId;
    }
    async getRoomHostByMeetingId(meetingId: number): Promise<number> {
        const hostId = await this.questionDAO.getRoomHost(meetingId);
        return hostId;
    }
    async getQuestionOwner(questionId: number): Promise<number> {
        const id = await this.questionDAO.getQuestionOwner(questionId);
        return id;
    }
    async getReplyOwner(replyId: number): Promise<number> {
        const id = await this.replyDAO.getReplyOwner(replyId);
        return id;
    }
    async updateReply(id: number, content: string): Promise<boolean> {
        const isUpdated = await this.replyDAO.updateReply(id, content);
        if (!isUpdated) throw new Error('Fail to update reply - unknown error!');
        return isUpdated;
    }
    async createReply(questionId: number, content: string, guestId: number): Promise<replyDB> {
        const insertId = await this.replyDAO.createReply(questionId, content, guestId);
        const reply = await this.replyDAO.getReplyById(insertId);
        return reply;
    }
    async deleteReply(id: number): Promise<boolean> {
        const isDeleted = await this.replyDAO.deleteReply(id);
        if (!isDeleted) throw new Error('Fail to delete reply - unknown error!');
        return isDeleted;
    }
    async hideReply(replyId: number, isHide: boolean): Promise<boolean> {
        const isOk = await this.replyDAO.hideReply(replyId, isHide);
        if (!isOk) throw new Error('Fail to hide/display reply - unknown error!');
        return isOk;
    }
    async getRoomIdByQuestionId(questionId:number): Promise<number> {
        const question = await this.questionDAO.getQuestionById(questionId);
        return question.meetingId;
    }
    async getRoomIdByReplyId(replyId: number): Promise<number> {
        const roomId = await this.replyDAO.getRoomIdByReplyId(replyId);
        return roomId;
    }
    async getQuestionIdByReplyId(replyId: number): Promise<number> {
        const reply = await this.replyDAO.getReplyById(replyId);
        return reply.questionId;
    }
    async buildQuestion(arr: questionDB[]): Promise<question[]> {
        const questionArr: question[] = [];
        for (const question of arr) {
            const likes = await this.questionDAO.getQuestionLikes(question.id);
            const replies: replyDB[] = await this.replyDAO.getQuestionReplies(question.id);
            const files = await this.questionDAO.getQuestionFiles(question.id);
            const { guestId, guestName, platformId, platformName, createdAt, updatedAt, ...obj } = question
            const questioner = { id: guestId, name: guestName };
            const platform = { id: platformId, name: platformName };
            questionArr.push({ ...obj, questioner, likes, replies, files, platform, createdAt, updatedAt });
        }
        return questionArr;
    }
}