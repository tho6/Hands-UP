import Knex from "knex";
import { seed } from '../../seeds/create-questions';
import { QuestionDAO } from "./questionDAO";
import { questionDB, customFileDB } from "../../models/type/questionFromDB";


const knexConfig = require("../../knexfile");
const knex = Knex(knexConfig["development"]);
// const knex = Knex(knexConfig["testing"]);
// console.log(knex);
describe('QuestionDAO', () => {
    const questionDAO = new QuestionDAO(knex)
    beforeEach(async () => {
        await seed(knex);
    })
    afterAll(async () => {
        await knex.destroy();
    })
    const defaultQuestion = [
        {
            id: 1,
            guestId: 1,
            guestName: 'guest1',
            content: 'question 1',
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
            isHide: false,
            meetingId: 1,
            platformId: 1,
            platformName: 'project3',
            isAnswered: false,
            isApproved: false,
            platformUsername: null
        },
        {
            id: 2,
            guestId: 2,
            guestName: 'guest2',
            content: 'question 2',
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
            isHide: true,
            meetingId: 1,
            platformId: 1,
            platformName: 'project3',
            isAnswered: true,
            isApproved: true,
            platformUsername: null
        }
    ]
    it('getQuestionsByRoomId - normal', async () => {
        const expectedResult: questionDB[] = defaultQuestion;
        const questions: questionDB[] = await questionDAO.getQuestionsByRoomId(1);
        expect(questions).toEqual(expectedResult);
    });
    it('getQuestionsByRoomId - no questions', async () => {
        const expectedResult: questionDB[] = [
        ]
        const questions: questionDB[] = await questionDAO.getQuestionsByRoomId(2);
        expect(questions).toEqual(expectedResult);
    });
    it('getQuestionLikes - normal', async () => {
        const expectedResult: number[] = [1, 2]
        const likes: number[] = await questionDAO.getQuestionLikes(1);
        expect(likes).toEqual(expectedResult);
    });
    it('getQuestionFiles - normal', async () => {
        const expectedResult: customFileDB[] = [{ id: 1, filename: '123.png' }]
        const filesDB: customFileDB[] = await questionDAO.getQuestionFiles(1);
        expect(filesDB).toEqual(expectedResult);
    });
    it('getQuestionFiles - no files', async () => {
        const expectedResult: customFileDB[] = [];
        const filesDB: customFileDB[] = await questionDAO.getQuestionFiles(10);
        expect(filesDB).toEqual(expectedResult);
    });
    it('updateQuestion - no files', async () => {
        const isUpdate: boolean = await questionDAO.updateQuestion(1, 'update string', [], [], true);
        expect(isUpdate).toBe(true);
        const result = await questionDAO.getQuestionsByRoomId(1);
        const expectedResult: questionDB[] = [{
            ...defaultQuestion[0],
            content: 'update string',
            isApproved: true,
        }, defaultQuestion[1]
        ];
        expect(result).toEqual(expectedResult);
        const files = await questionDAO.getQuestionFiles(1);
        expect(files).toEqual([{ id: 1, filename: '123.png' }])
    });
    it('updateQuestion - delete 1 files - normal', async () => {
        const isUpdate: boolean = await questionDAO.updateQuestion(1, 'question 1', [1], [], false);
        expect(isUpdate).toBe(true);
        const result = await questionDAO.getQuestionsByRoomId(1);
        const expectedResult: questionDB[] = [defaultQuestion[0], defaultQuestion[1]];
        expect(result).toEqual(expectedResult);
        const files = await questionDAO.getQuestionFiles(1);
        expect(files).toEqual([]);
    });
    it('updateQuestion - delete 1 files - with no such file in the question', async () => {
        await expect(questionDAO.updateQuestion(1, 'question 1', [5], [], false)).rejects.toThrowError('Fail to update question - delete files');
        const result = await questionDAO.getQuestionsByRoomId(1);
        expect(result).toEqual(defaultQuestion);
    });
    it('updateQuestion - upload 1 file', async () => {
        const isUpdate: boolean = await questionDAO.updateQuestion(1, 'question 1', [1], ['456.png'], false);
        expect(isUpdate).toBe(true);
        const result = await questionDAO.getQuestionsByRoomId(1);
        const expectedResult: questionDB[] = [defaultQuestion[0], defaultQuestion[1]];
        expect(result).toEqual(expectedResult);
        const files = await questionDAO.getQuestionFiles(1);
        expect(files).toEqual([{ id: 2, filename: '456.png' }])
    });
    it('createQuestion - no files', async () => {
        const insertId: number = await questionDAO.createQuestion(2, 'create question 3', [], false, 1, 1);
        expect(insertId).toBe(3);
        const result = await questionDAO.getQuestionsByRoomId(2);
        const expectedResult: questionDB[] = [
            {
                id: 3,
                guestId: 1,
                guestName: 'guest1',
                content: 'create question 3',
                createdAt: result[0].createdAt,
                updatedAt: result[0].updatedAt,
                isHide: false,
                meetingId: 2,
                platformId: 1,
                platformName: 'project3',
                isAnswered: false,
                isApproved: false,
                platformUsername: null
            }]
        expect(result).toEqual(expectedResult);
    });
    it('createQuestion - with files', async () => {
        const insertId: number = await questionDAO.createQuestion(2, 'create question 3', ['file2 in 2', 'file3 in 2'], true, 2, 3);
        expect(insertId).toBe(3);
        const result = await questionDAO.getQuestionsByRoomId(2);
        const expectedResult: questionDB[] = [
            {
                id: 3,
                guestId: 3,
                guestName: 'guest3',
                content: 'create question 3',
                createdAt: result[0].createdAt,
                updatedAt: result[0].updatedAt,
                isHide: false,
                meetingId: 2,
                platformId: 2,
                platformName: 'facebook',
                isAnswered: false,
                isApproved: true,
                platformUsername: null
            }]
        expect(result).toEqual(expectedResult);
        const expectFilesResult = [{ id: 2, filename: 'file2 in 2' }, { id: 3, filename: 'file3 in 2' }]
        const filesResult = await questionDAO.getQuestionFiles(3);
        expect(filesResult).toEqual(expectFilesResult);
    });
    it('createQuestion - with no guestId', async () => {
        const insertId: number = await questionDAO.createQuestion(2, 'create question 3', [], false, 2, null);
        expect(insertId).toBe(3);
        const result = await questionDAO.getQuestionsByRoomId(2);
        const expectedResult: questionDB[] = [
            {
                id: 3,
                guestId: null,
                guestName: null,
                content: 'create question 3',
                createdAt: result[0].createdAt,
                updatedAt: result[0].updatedAt,
                isHide: false,
                meetingId: 2,
                platformId: 2,
                platformName: 'facebook',
                isAnswered: false,
                isApproved: false,
                platformUsername: null
            }]
        expect(result).toEqual(expectedResult);
    });
    it('createQuestion - no roomId', async () => {
        await expect(questionDAO.createQuestion(10, 'create question 3', [], false, 2, null)).rejects.toThrowError();
    });
    it('deleteQuestion - normal', async () => {
        const isDeleted = await questionDAO.deleteQuestion(2);
        expect(isDeleted).toBe(true);
        const expectedResult: questionDB[] = [
            {
                id: 1,
                guestId: 1,
                guestName: 'guest1',
                content: 'question 1',
                createdAt: new Date("2020-05-23T12:00:00.000z"),
                updatedAt: new Date("2020-05-23T12:00:00.000z"),
                isHide: false,
                meetingId: 1,
                platformId: 1,
                platformName: 'project3',
                isAnswered: false,
                isApproved: false,
                platformUsername: null
            }]
        const result = await questionDAO.getQuestionsByRoomId(1);
        expect(result).toEqual(expectedResult);
    });
    it('deleteQuestion - question is not found', async () => {
        await expect(questionDAO.deleteQuestion(10)).rejects.toThrowError(`Fail to deleteQuestion, question is not found!`);
    });
    it('addVote - normal', async () => {
        const isVoted = await questionDAO.addVote(1, 3);
        expect(isVoted).toBe(true);
        const result: number[] = await questionDAO.getQuestionLikes(1);
        expect(result).toEqual([1, 2, 3])
    });
    it('removeVote - normal', async () => {
        const isRemoved = await questionDAO.removeVote(1, 2);
        expect(isRemoved).toBe(true);
        const result: number[] = await questionDAO.getQuestionLikes(1);
        expect(result).toEqual([1])
    });
    it('addVote - no such record', async () => {
        await expect(questionDAO.addVote(5, 2)).rejects.toThrowError();
    });
    it('removeVote - no such record', async () => {
        await expect(questionDAO.removeVote(2, 2)).rejects.toThrowError('Fail to removeVote!');
    });
    it('answered question - normal', async () => {
        const expectedResult: questionDB[] = [
            {
                id: 1,
                guestId: 1,
                guestName: 'guest1',
                content: 'question 1',
                createdAt: new Date("2020-05-23T12:00:00.000z"),
                updatedAt: new Date("2020-05-23T12:00:00.000z"),
                isHide: false,
                meetingId: 1,
                platformId: 1,
                platformName: 'project3',
                isAnswered: true,
                isApproved: false,
                platformUsername: null
            }, {
                id: 2,
                guestId: 2,
                guestName: 'guest2',
                content: 'question 2',
                createdAt: new Date("2020-05-23T12:00:00.000z"),
                updatedAt: new Date("2020-05-23T12:00:00.000z"),
                isHide: true,
                meetingId: 1,
                platformId: 1,
                platformName: 'project3',
                isAnswered: true,
                isApproved: true,
                platformUsername: null
            },
        ]
        const isAnswered = await questionDAO.answeredQuestion(1);
        expect(isAnswered).toBe(true);
        const result: questionDB[] = await questionDAO.getQuestionsByRoomId(1);
        expect(result).toEqual(expectedResult)
    });
    it('answered question - fail to answer', async () => {
        await expect(questionDAO.answeredQuestion(10)).rejects.toThrowError('Fail to answer question - question is not found!');
    });
    it('hide and approve questions - normal', async () => {
        const expectedResult: questionDB[] = [
            {
                id: 1,
                guestId: 1,
                guestName: 'guest1',
                content: 'question 1',
                createdAt: new Date("2020-05-23T12:00:00.000z"),
                updatedAt: new Date("2020-05-23T12:00:00.000z"),
                isHide: true,
                meetingId: 1,
                platformId: 1,
                platformName: 'project3',
                isAnswered: false,
                isApproved: false,
                platformUsername: null
            },
            {
                id: 2,
                guestId: 2,
                guestName: 'guest2',
                content: 'question 2',
                createdAt: new Date("2020-05-23T12:00:00.000z"),
                updatedAt: new Date("2020-05-23T12:00:00.000z"),
                isHide: false,
                meetingId: 1,
                platformId: 1,
                platformName: 'project3',
                isAnswered: true,
                isApproved: true,
                platformUsername: null
            }
        ]
        const isHide = await questionDAO.hideQuestion(1);
        const isApproved = await questionDAO.approvedQuestion(2);
        expect(isHide).toBe(true);
        expect(isApproved).toEqual(true)
        const result: questionDB[] = await questionDAO.getQuestionsByRoomId(1);
        expect(result).toEqual(expectedResult)
    });
    it('hide and approve questions - fail to hide or approve questions', async () => {
        await expect(questionDAO.hideQuestion(10)).rejects.toThrowError('Fail to hide question - question is not found!');
        await expect(questionDAO.approvedQuestion(10)).rejects.toThrowError('Fail to approve question - question is not found!');
    });
    it('getRoomHost - normal', async () => {
        const result = await questionDAO.getRoomHost(1);
        expect(result).toBe(1);
    });
    it('getRoomHost - room is not found', async () => {
        await expect(questionDAO.getRoomHost(10)).rejects.toThrowError('Fail to getHost - room is not found!');
    });
    it('getQuestionOwner - normal', async () => {
        const result = await questionDAO.getQuestionOwner(2);
        expect(result).toBe(2);
    });
    it('getQuestionOwner - question is not found', async () => {
        await expect(questionDAO.getQuestionOwner(10)).rejects.toThrowError(`Fail to get question owner - question is not found!`);
    });
    it('getMeetingConfiguration - normal', async () => {
        const result = await questionDAO.getMeetingConfiguration(1);
        const expectedResult = { isLive: false, canModerate: false, canUploadFile: false, questionLimit: 3 };
        expect(result).toEqual(expectedResult);
    });
    it('getMeetingIdByQuestionId - normal', async () => {
        const result = await questionDAO.getMeetingIdByQuestion(1);
        expect(result).toBe(1);
    });
    it('getQuestionById - normal', async () => {
        const result = await questionDAO.getQuestionById(1);
        expect(result).toEqual(defaultQuestion[0]);
    });

});