import { seed } from "../seeds/create-questions";
import Knex from 'knex';
import { QuestionRouter } from "./QuestionRouter";
import { IQuestionService } from "../models/Interface/IQuestionService";
import { QuestionService } from "../services/QuestionService";
import { IQuestionDAO } from "../models/Interface/IQuestionDAO";
import { IReplyDAO } from "../models/Interface/IReplyDAO";
import { QuestionDAO } from "../services/dao/questionDAO";
import { ReplyDAO } from "../services/dao/replyDAO";

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig["testing"]);

describe('Question Router', () => {
    let questionDAO: IQuestionDAO = new QuestionDAO(knex);
    let replyDAO: IReplyDAO = new ReplyDAO(knex);
    let questionRouter: QuestionRouter;
    let questionService: IQuestionService;
    const io = {
        in: jest.fn(() => io),
        emit: jest.fn()
    } as any
    beforeEach(async () => {
        io.in.mockClear();
        io.emit.mockClear();
        await seed(knex);
        questionService = new QuestionService(questionDAO, replyDAO)
        questionRouter = new QuestionRouter(questionService, {}, io);
    });
    afterAll(async () => {
        await knex.destroy();
    })
    const createdAt = new Date("2020-05-23T12:00:00.000z");
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
    it('getQuestionsByRoomId', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            params: {
                id: 1
            }
        } as any;
        await questionRouter.getQuestionsByRoomId(req, res);
        //assert
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: true, message: defaultQuestions });
        expect(res.status).toBeCalledWith(200);
    });
    it('getQuestionsByRoomId - no such room', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            params: {
                id: 10
            }
        } as any;
        await questionRouter.getQuestionsByRoomId(req, res);
        //assert
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: true, message: [] });
        expect(res.status).toBeCalledWith(200);
    });
    it('createQuestion - normal (room1)', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'This is a new question'
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
            files: []
        } as any;
        await questionRouter.createQuestion(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        const question = await questionService.getQuestionsByRoomId(1);
        expect(io.emit).toBeCalledWith('create-question', question[2]);
        expect(res.json).toBeCalledWith({ status: true, message: question[2] });
        expect(res.status).toBeCalledWith(200);
    });
    it('createQuestion - normal spam', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                content: 'This is a new question'
            },
            params: { id: 1 },
            personInfo: { guestId: 3 },
            files: []
        } as any;
        await questionRouter.createQuestion(req, res);
        await questionRouter.createQuestion(req, res);
        await questionRouter.createQuestion(req, res);
        await questionRouter.createQuestion(req, res);
        //assert
        expect(io.in).toBeCalledTimes(3);
        expect(res.json).toBeCalledTimes(4);
        const question = await questionService.getQuestionsByRoomId(1);
        expect(io.emit).toHaveBeenNthCalledWith(1,'create-question', question[2]);
        expect(io.emit).toHaveBeenNthCalledWith(2,'create-question', question[3]);
        expect(io.emit).toHaveBeenNthCalledWith(3,'create-question', question[4]);
        expect(res.json).toHaveBeenNthCalledWith(4, {status:false, message:'Exceed question limits!'});
    });
    it('createQuestion - with files should get error (room1)', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'This is a new question'
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
            files: ['13.png']
        } as any;
        await questionRouter.createQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: "This room is not allowed to upload any files!" });
        expect(res.status).toBeCalledWith(500);
    });
    it('createQuestion - not logged in', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'This is a new question'
            },
            params: { id: 1 },
            files: ['13.png']
        } as any;
        await questionRouter.createQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: "Not Logged In Yet!" });
        expect(res.status).toBeCalledWith(400);
    });
    it('createQuestion - empty content', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: ""
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
            files: []
        } as any;
        await questionRouter.createQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: 'Question cannot be empty!' });
        expect(res.status).toBeCalledWith(400);
    });
    it('update question - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
            files: []
        } as any;
        await questionRouter.updateQuestion(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('update-question', { "content": "update", "deleteFilesId": [], "files": [{ "filename": "123.png", "id": 1 }], "isApproved": true, "questionId": 1, "updatedAt": expect.anything() });
        expect(res.status).toBeCalledWith(200);
    });
    it('update question - delete files missing', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'sth',
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
            files: []
        } as any;
        await questionRouter.updateQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalledTimes(1);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: 'Property deleteFilesId is missing!' });
        expect(io.emit).not.toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(400);
    });
    it('update question - content empty', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: '',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
            files: []
        } as any;
        await questionRouter.updateQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalledTimes(1);
        expect(io.in).not.toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).not.toBeCalledTimes(1);
        expect(io.emit).not.toBeCalledWith('update-question', { "content": "update", "deleteFilesId": [], "files": [{ "filename": "123.png", "id": 1 }], "isApproved": true, "questionId": 1, "updatedAt": expect.anything() });
        expect(res.status).toBeCalledWith(400);
    });
    it('update question - delete files', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'update',
                deleteFilesId: [1]
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
            files: []
        } as any;
        await questionRouter.updateQuestion(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('update-question', { "content": "update", "deleteFilesId": [1], "files": [], "isApproved": true, "questionId": 1, "updatedAt": expect.anything() });
        expect(res.status).toBeCalledWith(200);
    });
    it('update question - invalid filesId', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'update',
                deleteFilesId: [-1]
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
            files: []
        } as any;
        await questionRouter.updateQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: 'Invalid deleFilesId!' });
        expect(io.emit).not.toBeCalled();
        expect(res.status).toBeCalledWith(400);
    });
    it('update question - not host and not owner', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 2,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 2 },
            files: []
        } as any;
        await questionRouter.updateQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: 'You are not allowed to update the question!' });
        expect(io.emit).not.toBeCalled();
        expect(res.status).toBeCalledWith(400);
    });
    it('update question - is host, not owner', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 2,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 2, userId: 1 },
            files: []
        } as any;
        await questionRouter.updateQuestion(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('update-question', { "content": "update", "deleteFilesId": [], "files": [{ "filename": "123.png", "id": 1 }], "isApproved": true, "questionId": 1, "updatedAt": expect.anything() });
        expect(res.status).toBeCalledWith(200);
    });
    it('delete question - owner', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
            files: []
        } as any;
        await questionRouter.deleteQuestion(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('delete-question', { "meetingId": 1, "questionId": 1 });
        expect(res.status).toBeCalledWith(200);
    });
    it('delete question - host', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 10,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 10, userId: 1 },
            files: []
        } as any;
        await questionRouter.deleteQuestion(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('delete-question', { "meetingId": 1, "questionId": 1 });
        expect(res.status).toBeCalledWith(200);
    });
    it('delete question - not owner/host', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 2,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 2, userId: 2 },
            files: []
        } as any;
        await questionRouter.deleteQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).not.toBeCalled();
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledWith({ status: false, message: `You are not allowed to delete the question!` });
    });
    it('vote - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 3, userId: 1 },
            files: []
        } as any;
        await questionRouter.addVote(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('add-vote', { "guestId": 3, "questionId": 1 });
        expect(res.status).toBeCalledWith(200);
    });
    it('delete question - same person vote for the same question again', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 1, userId: 1 },
            files: []
        } as any;
        await questionRouter.addVote(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).not.toBeCalled();
        expect(res.json).toBeCalledWith({ status: false, message: expect.anything() });
    });
    it('remove vote - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 1, userId: 1 },
            files: []
        } as any;
        await questionRouter.removeVote(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('remove-vote', { "guestId": 1, "questionId": 1 });
        expect(res.status).toBeCalledWith(200);
    });
    it('remove vote - remove vote from a questions that never voted for it', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 3, userId: 1 },
            files: []
        } as any;
        await questionRouter.removeVote(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).not.toBeCalled();
        expect(res.json).toBeCalledWith({ status: false, message: expect.anything() });
    });
    it('answered question - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 3, userId: 1 },
            files: []
        } as any;
        await questionRouter.answeredQuestion(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('answered-question', { "questionId": 1 });
        expect(res.status).toBeCalledWith(200);
    });
    it('answered question - not host', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 3, userId: 2 },
            files: []
        } as any;
        await questionRouter.answeredQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).not.toBeCalled();
        expect(res.json).toBeCalledWith({ status: false, message: `You are not allowed to delete the question!` });
    });
    it('answered question - not a user', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                content: 'update',
                deleteFilesId: []
            },
            params: { id: 1 },
            personInfo: { guestId: 3 },
            files: []
        } as any;
        await questionRouter.answeredQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).not.toBeCalled();
        expect(res.json).toBeCalledWith({ status: false, message: `You are not allowed to delete the question!` });
    });
    it('hide question - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                isHide: true
            },
            params: { id: 1 },
            personInfo: { guestId: 3, userId: 1 },
            files: []
        } as any;
        await questionRouter.hideOrApprovedQuestion(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('hideOrApproved-question', { "isHide": true, "questionId": 1 });
        expect(res.status).toBeCalledWith(200);
    });
    it('approved question - isHide not a boolean', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                isHide: 1
            },
            params: { id: 1 },
            personInfo: { guestId: 3, userId: 1 },
            files: []
        } as any;
        await questionRouter.hideOrApprovedQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: `isHide should be a boolean!` });
        expect(io.emit).not.toBeCalled();
        expect(res.status).toBeCalledWith(400);
    });
    it('approved question - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                isHide: false
            },
            params: { id: 1 },
            personInfo: { guestId: 3, userId: 1 },
            files: []
        } as any;
        await questionRouter.hideOrApprovedQuestion(req, res);
        //assert
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('hideOrApproved-question', { "isHide": false, "questionId": 1 });
        expect(res.status).toBeCalledWith(200);
    });
    it('approved question - not host', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                isHide: true
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
            files: []
        } as any;
        await questionRouter.hideOrApprovedQuestion(req, res);
        //assert
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: `You are not allowed to delete the question!` });
        expect(io.emit).not.toBeCalled();
        expect(res.status).toBeCalledWith(400);
    });
    it('update reply - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 2,
                content: 'update reply',
            },
            params: { id: 1 },
            personInfo: { guestId: 2 },
        } as any;
        await questionRouter.updateReply(req, res);
        //assert    
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('update-reply', { "content": "update reply", "questionId": 1, "replyId": 1, "updatedAt": expect.anything() });
        expect(res.status).toBeCalledWith(200);
    });
    it('update reply - host', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'update reply',
            },
            params: { id: 1 },
            personInfo: { guestId: 1, userId: 1 },
        } as any;
        await questionRouter.updateReply(req, res);
        //assert    
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('update-reply', { "content": "update reply", "questionId": 1, "replyId": 1, "updatedAt": expect.anything() });
        expect(res.status).toBeCalledWith(200);
    });
    it('update reply - empty reply', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 2,
                content: ' ',
            },
            params: { id: 1 },
            personInfo: { guestId: 2 },
        } as any;
        await questionRouter.updateReply(req, res);
        //assert    
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: 'Reply cannot be empty!' });
        expect(io.emit).not.toBeCalled();
        expect(res.status).toBeCalledWith(400);
    });
    it('update reply -not owner', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'sth',
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
        } as any;
        await questionRouter.updateReply(req, res);
        //assert    
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: 'You are not allowed to update this reply!' });
        expect(io.emit).not.toBeCalled();
        expect(res.status).toBeCalledWith(400);
    });
    it('create reply - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
                content: 'new reply',
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
        } as any;
        const expectedReply = {
            id: 2,
            guestId: 1,
            guestName: 'guest1',
            content: 'new reply',
            questionId: 1,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
            isHide: false
        }
        await questionRouter.createReply(req, res);
        //assert    
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('create-reply', expectedReply);
        expect(res.status).toBeCalledWith(200);
    });
    it('delete reply - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 2,
            },
            params: { id: 1 },
            personInfo: { guestId: 2 },
        } as any;
        await questionRouter.deleteReply(req, res);
        //assert    
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('delete-reply', {questionId:1, replyId:1});
        expect(res.status).toBeCalledWith(200);
    });
    it('delete reply - host', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
            },
            params: { id: 1 },
            personInfo: { guestId: 1, userId:1 },
        } as any;
        await questionRouter.deleteReply(req, res);
        //assert    
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('delete-reply', {questionId:1, replyId:1});
        expect(res.status).toBeCalledWith(200);
    });
    it('delete reply - not owner', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 1,
            },
            params: { id: 1 },
            personInfo: { guestId: 1 },
        } as any;
        await questionRouter.deleteReply(req, res);
        //assert    
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({status:false, message: 'You are not allowed to delete this reply!'});
        expect(io.emit).not.toBeCalled();
        expect(res.status).toBeCalledWith(400);
    });
    it('hide reply - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                isHide:true
            },
            params: { id: 1 },
            personInfo: { guestId: 3, userId:1 },
        } as any;
        await questionRouter.hideOrNotHideReply(req, res);
        //assert    
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('hideOrNotHide-reply', {replyId:1, questionId:1, isHide:true});
        expect(res.status).toBeCalledWith(200);
    });
    it('display reply - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                isHide:false
            },
            params: { id: 1 },
            personInfo: { guestId: 3, userId:1 },
        } as any;
        await questionRouter.hideOrNotHideReply(req, res);
        //assert    
        expect(io.in).toBeCalledTimes(1);
        expect(io.in).toBeCalledWith('meeting:1');
        expect(res.json).toBeCalledTimes(1);
        expect(io.emit).toBeCalledTimes(1);
        expect(io.emit).toBeCalledWith('hideOrNotHide-reply', {replyId:1, questionId:1, isHide:false});
        expect(res.status).toBeCalledWith(200);
    });
    it('hide/display reply - not host', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            body: {
                guestId: 3,
                isHide:false
            },
            params: { id: 1 },
            personInfo: { guestId: 3, userId:2 },
        } as any;
        await questionRouter.hideOrNotHideReply(req, res);
        //assert    
        expect(io.in).not.toBeCalled();
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({status:false, message:'You are not allowed to hide/display this reply!'});
        expect(io.emit).not.toBeCalled();
        expect(res.status).toBeCalledWith(400);
    });

})