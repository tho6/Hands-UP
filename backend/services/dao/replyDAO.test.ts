import Knex from "knex";
import { seed } from '../../seeds/create-questions';
import { ReplyDAO } from './replyDAO';
import { replyDB } from "../../models/type/replyFromDB";

const knexConfig = require("../../knexfile");
const knex = Knex(knexConfig[process.env.TESTING_ENV||'cicd']);
// console.log(knex);
describe('replyDAO', () => {
    const replyDAO = new ReplyDAO(knex)
    beforeEach(async () => {
        await seed(knex);
    })
    afterAll(async () => {
        await knex.destroy();
    })
    it('getQuestionReplies - normal', async () => {
        const expectedResult: replyDB[] = [
            {
                id: 1,
                guestId: 2,
                guestName: 'guest2',
                content: 'reply 1',
                createdAt: new Date("2020-05-23T12:00:00.000z"),
                updatedAt: new Date("2020-05-23T12:00:00.000z"),
                isHide: false,
                questionId: 1
            }
        ]
        const replies: replyDB[] = await replyDAO.getQuestionReplies(1);
        expect(replies).toEqual(expectedResult);
    });
    it('getQuestionReplies - no questions in the room', async () => {
        const expectedResult: replyDB[] = [];
        const replies: replyDB[] = await replyDAO.getQuestionReplies(2);
        expect(replies).toEqual(expectedResult);
    });
    it('updateReply - normal', async () => {
        const isUpdate = await replyDAO.updateReply(1,'update update reply');
        expect(isUpdate).toBe(true);
        const result = await replyDAO.getQuestionReplies(1);
                    const expectedResult: replyDB[] = [
                        {
                            id: 1,
                            guestId: 2,
                            guestName: 'guest2',
                            content: 'update update reply',
                            createdAt: new Date("2020-05-23T12:00:00.000z"),
                            updatedAt: result[0].updatedAt,
                            isHide: false,
                            questionId: 1
                        }
                    ]
        expect(expectedResult).toEqual(result);
    });
    it('updateReply - question is not found', async () => {
        await expect(replyDAO.updateReply(10, 'update 1234')).rejects.toThrowError('Fail tp update reply - reply is not found!');
    });
    it('createReply - normal', async () => {
        const isCreated = await replyDAO.createReply(1, 'create a new question',1);
        expect(isCreated).toEqual(2);
        const result = await replyDAO.getQuestionReplies(1);
                    const expectedResult: replyDB[] = [
                        {
                            id: 1,
                            guestId: 2,
                            guestName: 'guest2',
                            content: 'reply 1',
                            createdAt: new Date("2020-05-23T12:00:00.000z"),
                            updatedAt: new Date("2020-05-23T12:00:00.000z"),
                            isHide: false,
                            questionId: 1
                        },
                        {
                            id: 2,
                            guestId: 1,
                            guestName: 'guest1',
                            content: 'create a new question',
                            createdAt: result[1].createdAt,
                            updatedAt: result[1].updatedAt,
                            isHide: false,
                            questionId: 1
                        }
                    ]
        expect(result).toEqual(expectedResult)
    });
    it('createReply - question room is not found', async () => {
        await expect(replyDAO.createReply(10, 'create a new question',1)).rejects.toThrowError();
    });
    it('createReply - guestId is not found', async () => {
        await expect(replyDAO.createReply(1, 'create a new question',10)).rejects.toThrowError();
    });
    it('deleteReply - normal', async () => {
        const isDeleted = await replyDAO.deleteReply(1);
        expect(isDeleted).toEqual(true);
        const result = await replyDAO.getQuestionReplies(1);
        expect(result).toEqual([]);
    });
    it('deleteReply - reply is not found', async () => {
       await expect(replyDAO.deleteReply(109)).rejects.toThrowError('Fail to delete reply - reply is not found!');
    });
    it('hideReply - hide reply then display it back', async () => {
        {
        const isHide = await replyDAO.hideReply(1, true);
        expect(isHide).toBe(true);
        
            const result = await replyDAO.getQuestionReplies(1);
                        const expectedResult: replyDB[] = [
                            {
                                id: 1,
                                guestId: 2,
                                guestName: 'guest2',
                                content: 'reply 1',
                                createdAt: new Date("2020-05-23T12:00:00.000z"),
                                updatedAt: new Date("2020-05-23T12:00:00.000z"),
                                isHide: true,
                                questionId: 1
                            }
                        ]
            expect(expectedResult).toEqual(result);
        }
        {
        const isHide = await replyDAO.hideReply(1, false);
        expect(isHide).toBe(true);
            const result = await replyDAO.getQuestionReplies(1);
                        const expectedResult: replyDB[] = [
                            {
                                id: 1,
                                guestId: 2,
                                guestName: 'guest2',
                                content: 'reply 1',
                                createdAt: new Date("2020-05-23T12:00:00.000z"),
                                updatedAt: new Date("2020-05-23T12:00:00.000z"),
                                isHide: false,
                                questionId: 1
                            }
                        ]
            expect(expectedResult).toEqual(result);
        }
    });
    it('hideReply - reply is not found', async () => {
        await expect(replyDAO.hideReply(100, true)).rejects.toThrowError('Fail to hide reply - reply is not found!');   
    });
    it('getReplyOwner -normal', async () => {
       const result = await replyDAO.getReplyOwner(1);
       expect(result).toBe(2);
    });
    it('getReplyOwner - reply owner is not found', async () => {
        await expect(replyDAO.getReplyOwner(100)).rejects.toThrowError('Fail to get reply owner - reply is not found');   
    });
    it('getRoomIdByReplyId - normal', async () => {
        const id = await replyDAO.getRoomIdByReplyId(1);
        expect(id).toBe(1);
    });
    it('getRoomIdByReplyId - reply is not found', async () => {
        await expect(replyDAO.getRoomIdByReplyId(20)).rejects.toThrowError('Fail to get room id - reply is not found!');   
    });
});