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
    })
    it.only('update question - is host, not owner', async () => {
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
    })

})