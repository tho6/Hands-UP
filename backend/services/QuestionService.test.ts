import { seed } from "../seeds/create-questions";
import Knex from 'knex';
const knexConfig = require("../knexfile");
const knex = Knex(knexConfig["testing"]);
import { QuestionService } from "./QuestionService";
import { QuestionDAO } from "./dao/questionDAO";
import { ReplyDAO } from "./dao/replyDAO";
//@ts-ignore
import redis from 'redis';



describe
    ('Question Service', () => {
        beforeEach(async () => {
            await seed(knex);
        })
        afterAll(async () => {
            await knex.destroy();
        })
        const createdAt = new Date("2020-05-23T12:00:00.000z");
        const questionDao = new QuestionDAO(knex);
        const replyDao = new ReplyDAO(knex);    
        //const client = redis.createClient();
        const questionService = new QuestionService(questionDao, replyDao);
        //const questionService = new QuestionService(questionDao, replyDao,client);
        const defaultReply = {
            id: 1,
            guestId: 2,
            guestName: 'guest2',
            content: 'reply 1',
            questionId: 1,
            createdAt: createdAt,
            updatedAt: createdAt,
            isHide: false
        };
        const defaultQuestions = [{
            id: 1,
            questioner: {
                name: 'guest1',
                id: 1,
            },
            content: "question 1",
            likes: [1, 2],
            replies: [defaultReply],
            files: [{ id: 1, filename: '123.png' }],
            meetingId: 1,
            platform: { id: 1, name: 'project3' },
            isHide: false,
            isAnswered: false,
            isApproved: false,
            createdAt: createdAt,
            updatedAt: createdAt,
        },
        {
            id: 2,
            questioner: {
                name: 'guest2',
                id: 2,
            },
            content: "question 2",
            likes: [3],
            replies: [],
            files: [],
            meetingId: 1,
            platform: { id: 1, name: 'project3' },
            isHide: true,
            isAnswered: true,
            isApproved: true,
            createdAt: createdAt,
            updatedAt: createdAt,
        },
        ];
        const defaultCreateQuestionInRoom1 = {
            id: 3,
            questioner: {
                name: 'guest1',
                id: 1,
            },
            content: "This is a new question",
            likes: [],
            replies: [],
            files: [],
            meetingId: 1,
            platform: { id: 1, name: 'project3' },
            isHide: false,
            isAnswered: false,
            isApproved: true,
            createdAt: new Date(Date.now() + 2000),
            updatedAt: new Date(Date.now() + 2000),
        }

        it('getQuestionsByRoomId - normal', async () => {
            const questions = await questionService.getQuestionsByRoomId(1);
            expect(questions).toEqual(defaultQuestions);
        });
        it('getQuestionsByRoomId - no questions', async () => {
            const questions = await questionService.getQuestionsByRoomId(2);
            expect(questions).toEqual([]);
        });
        it('getQuestionsByRoomId - no room', async () => {
            const questions = await questionService.getQuestionsByRoomId(10);
            expect(questions).toEqual([]);
        });
        it('createQuestion - room1 with no guests(from other platform)(upload:false, moderate:false)', async () => {
            const questions = await questionService.createQuestion(1, 'This is a new question', [], 1, null);
            const expectedResult = { ...defaultCreateQuestionInRoom1, questioner: { id: null, name: null }, createdAt: questions.createdAt, updatedAt: questions.updatedAt }
            expect(questions).toEqual(expectedResult);
        });
        it('createQuestion - room1 with no files(upload:false, moderate:false)', async () => {
            const questions = await questionService.createQuestion(1, 'This is a new question', [], 1, 1);
            const expectedResult = { ...defaultCreateQuestionInRoom1, createdAt: questions.createdAt, updatedAt: questions.updatedAt }
            expect(questions).toEqual(expectedResult);
        });
        it('createQuestion - room1 with files(upload:false, moderate:false)', async () => {
            await expect(questionService.createQuestion(1, 'This is a new question', ['123.png'], 1, 1)).rejects.toThrowError('This room is not allowed to upload any files!');
        });
        it('createQuestion - room1 with files, 1 file only(upload:true, moderate:false)', async () => {
            const questions = await questionService.createQuestion(3, 'This is a new question', ['new.png'], 1, 1);
            const expectedResult = { ...defaultCreateQuestionInRoom1, meetingId: 3, files: [{ id: 2, filename: 'new.png' }], createdAt: questions.createdAt, updatedAt: questions.updatedAt }
            expect(questions).toEqual(expectedResult);
        });
        it('createQuestion - room1 with files, > 3 file(upload:true, moderate:false)', async () => {
            await expect(questionService.createQuestion(3, 'This is a new question', ['123.png', '123.png', '123.png', '123.png'], 1, 1)).rejects.toThrowError('You are not allowed to upload more than 3 images!');
        });
        it('createQuestion - room2 with no files (upload:true, moderate:true)', async () => {
            const questions = await questionService.createQuestion(2, 'This is a new question', [], 1, 1);
            const expectedResult = { ...defaultCreateQuestionInRoom1, meetingId: 2, createdAt: questions.createdAt, updatedAt: questions.updatedAt }
            expect(questions).toEqual(expectedResult);
        });
        it('createQuestion - room2 with files (upload:true, moderate:true)', async () => {
            const questions = await questionService.createQuestion(2, 'This is a new question', ['new1.png', 'new2.png'], 1, 1);
            const expectedResult = { ...defaultCreateQuestionInRoom1, isApproved: false, meetingId: 2, files: [{ id: 2, filename: 'new1.png' }, { id: 3, filename: 'new2.png' }], createdAt: questions.createdAt, updatedAt: questions.updatedAt }
            expect(questions).toEqual(expectedResult);
        });
        it('updateQuestion - room1 with no files uploaded (upload:false, moderate:false)', async () => {
            const isUpdate = await questionService.updateQuestion(1, 'update question', [], []);
            expect(isUpdate).toEqual({ files: [{ id: 1, filename: '123.png' }], needApproved: false });
            const question = await questionService.getQuestionsByRoomId(1);
            const expectedResult = [defaultQuestions[1],
            { ...defaultQuestions[0], content: 'update question', isApproved: true, updatedAt: question[1].updatedAt }];
            expect(question).toEqual(expectedResult);
        });
        it('updateQuestion - room1 delete one file (upload:false, moderate:false)', async () => {
            const isUpdate = await questionService.updateQuestion(1, 'update question', [1], []);
            expect(isUpdate).toEqual({ files: [], needApproved: false });
            const question = await questionService.getQuestionsByRoomId(1);
            const expectedResult = [defaultQuestions[1],
            { ...defaultQuestions[0], files: [], content: 'update question', isApproved: true, updatedAt: question[1].updatedAt }];
            expect(question).toEqual(expectedResult);
        });
        it('updateQuestion - room1 upload files (upload:false, moderate:false)', async () => {
            await expect(questionService.updateQuestion(1, 'update question', [1], ['123.s', '4124.s'])).rejects.toThrowError('This room is not allowed to upload any files!');
            const question = await questionService.getQuestionsByRoomId(1);
            expect(question).toEqual(defaultQuestions);
        });
        it('updateQuestion - room2 no such question (upload:true, moderate:true)', async () => {
            await expect(questionService.updateQuestion(10, 'update question', [], [])).rejects.toThrowError();
        });
        it('updateQuestion - room2 with no files uploaded (upload:true, moderate:true)', async () => {
            await questionService.createQuestion(2, 'abc', ['testing.png'], 1, 1)
            const isUpdate = await questionService.updateQuestion(3, 'update question', [], []);
            expect(isUpdate).toEqual({ files: [{ id: 2, filename: 'testing.png' }], needApproved: false });
            const question = await questionService.getQuestionsByRoomId(2);
            const expectedResult = [
                {
                    ...defaultCreateQuestionInRoom1,
                    meetingId: 2,
                    files: [{ id: 2, filename: 'testing.png' }],
                    content: 'update question',
                    isApproved: true,
                    createdAt: question[0].createdAt,
                    updatedAt: question[0].updatedAt
                }
            ];
            expect(question).toEqual(expectedResult);
        });
        it('updateQuestion - room2 with no files uploaded (upload:true, moderate:true)', async () => {
            await questionService.createQuestion(2, 'abc', ['testing.png'], 1, 1)
            const isUpdate = await questionService.updateQuestion(3, 'update question', [], ['testing2.png']);
            expect(isUpdate).toEqual({ files: [{ id: 2, filename: 'testing.png' },{ id: 3, filename: 'testing2.png' }], needApproved: true });
            const question = await questionService.getQuestionsByRoomId(2);
            const expectedResult = [
                {
                    ...defaultCreateQuestionInRoom1,
                    meetingId: 2,
                    files: [{ id: 2, filename: 'testing.png' },{ id: 3, filename: 'testing2.png' }],
                    content: 'update question',
                    isApproved: false,
                    createdAt: question[0].createdAt,
                    updatedAt: question[0].updatedAt
                }
            ];
            expect(question).toEqual(expectedResult);
        });
        it('updateQuestion - room2 delete files and update content wont need to be approved (upload:true, moderate:true)', async () => {
            await questionService.createQuestion(2, 'abc', ['testing.png'], 1, 1)
            const isUpdate = await questionService.updateQuestion(3, 'update question', [2], []);
            expect(isUpdate).toEqual({ files: [], needApproved: false });
            const question = await questionService.getQuestionsByRoomId(2);
            const expectedResult = [
                {
                    ...defaultCreateQuestionInRoom1,
                    meetingId: 2,
                    files: [],
                    content: 'update question',
                    isApproved: true,
                    createdAt: question[0].createdAt,
                    updatedAt: question[0].updatedAt
                }
            ];
            expect(question).toEqual(expectedResult);
        });
        it('updateQuestion - room2 question = 3 images (upload:true, moderate:true)', async () => {
            await questionService.createQuestion(2, 'abc', ['testing.png', 'testing2.png'], 1, 1)
            const isUpdate = await questionService.updateQuestion(3, 'update question', [2], ['testing3.png','testing4.png']);
            expect(isUpdate).toEqual({ files: [{id:3, filename:'testing2.png'}, {id:4, filename:'testing3.png'}, {id:5, filename:'testing4.png'}], needApproved: true });
            const question = await questionService.getQuestionsByRoomId(2);
            const expectedResult = [
                {
                    ...defaultCreateQuestionInRoom1,
                    meetingId: 2,
                    files: [{id:3, filename:'testing2.png'}, {id:4, filename:'testing3.png'}, {id:5, filename:'testing4.png'}],
                    content: 'update question',
                    isApproved: false,
                    createdAt: question[0].createdAt,
                    updatedAt: question[0].updatedAt
                }
            ];
            expect(question).toEqual(expectedResult);
        });
        it('updateQuestion - room2 question > 3 images (upload:true, moderate:true)', async () => {
            await questionService.createQuestion(2, 'abc', ['testing.png', 'testing2.png'], 1, 1)
            await expect(questionService.updateQuestion(3, 'update question', [2], ['testing3.png','testing4.png','testing5.png'])).rejects.toThrowError(`No more than 3 images for each question!`);
            const question = await questionService.getQuestionsByRoomId(2);
            const expectedResult = [
                {
                    ...defaultCreateQuestionInRoom1,
                    meetingId: 2,
                    files: [{id:2, filename:'testing.png'}, {id:3, filename:'testing2.png'}],
                    content: 'abc',
                    isApproved: false,
                    createdAt: question[0].createdAt,
                    updatedAt: question[0].updatedAt
                }
            ];
            expect(question).toEqual(expectedResult);
        });
        it('updateQuestion - room3 updated with images but do not need to be approve (upload:true, moderate:false)', async () => {
            await questionService.createQuestion(3, 'abc', ['testing.png', 'testing2.png'], 1, 1)
            const isUpdate = await questionService.updateQuestion(3, 'update question', [2], ['testing3.png','testing4.png']);
            expect(isUpdate).toEqual({ files: [{id:3, filename:'testing2.png'}, {id:4, filename:'testing3.png'}, {id:5, filename:'testing4.png'}], needApproved: false });
            const question = await questionService.getQuestionsByRoomId(3);
            const expectedResult = [
                {
                    ...defaultCreateQuestionInRoom1,
                    meetingId: 3,
                    files: [{id:3, filename:'testing2.png'}, {id:4, filename:'testing3.png'}, {id:5, filename:'testing4.png'}],
                    content: 'update question',
                    isApproved: true,
                    createdAt: question[0].createdAt,
                    updatedAt: question[0].updatedAt
                }
            ];
            expect(question).toEqual(expectedResult);
        });
        it('getRoomIdByQuestionId', async () => {
            const roomId = await questionService.getRoomIdByQuestionId(1);
            expect(roomId).toBe(1);
        });

    })