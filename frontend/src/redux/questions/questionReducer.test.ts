import { questionsReducer } from './reducers';
import { QuestionState } from './reducers';
import * as action from './actions';
import { IQuestion, updateQuestion } from '../../models/IQuestion';


describe('Question Reducer', () => {
    let initialState: QuestionState;
    let question:IQuestion;

    beforeEach(() => {
        question={
            id: 1,
            questioner: {
                name: 'Anonymous',
                id: 1,
            },
            content: "testing",
            likes: [1, 2, 3, 7, 8, 9],
            replies: [],
            files: [{ id: 1, filename: '1234.png' }, { id: 2, filename: '123.png' }],
            meetingId: 2,
            isHide: false,
            isAnswered: false,
            isApproved: true,
            createdAt: new Date(Date.now()+123),
            updatedAt: new Date(Date.now()+456),
            platform:{id:2, name:'facebook'}
        };
        initialState = {
            questions: {},
            questionsByMeetingId: {}
        };
    })

    it("add a question, first question", () => {
        const finalState = questionsReducer(initialState, action.addedQuestion(question));
        expect(finalState).toEqual({
            questions: { 1: question },
            questionsByMeetingId: { 2: [1] }
        });
    });
    it("add a question", () => {
        const initialState = {
            questions: { 2: question }, questionsByMeetingId: { 2: [2] }
        }
        const finalState = questionsReducer(initialState, action.addedQuestion(question));
        expect(finalState).toEqual({
            questions: { 1: question, 2: question },
            questionsByMeetingId: { 2: [2, 1] }
        });
    });
    it("loaded questions", () => {
        const finalState = questionsReducer(initialState, action.loadQuestions(2, [{ ...question, isApproved: false }, { ...question, id: 2 }]));
        expect(finalState).toEqual({
            questions: { 1: { ...question, isApproved: false }, 2: { ...question, id: 2 } },
            questionsByMeetingId: { 2: [1, 2] }
        });
    });
    it("delete question", () => {
        const initialState = {
            questions: { 1: question }, questionsByMeetingId: { 2: [1] }
        }
        const obj = { questions: {}, questionsByMeetingId: { 2: [] } }
        const finalState = questionsReducer(initialState, action.successfullyDeleteQuestion(1, 2));
        expect(finalState).toEqual(obj)
    });
    it("update question", () => {
        const initialState = {
            questions: { 1: question }, questionsByMeetingId: { 2: [1] }
        }
        const expectedObj = {
            id: 1,
            questioner: {
                name: 'Anonymous',
                id: 1,
            },
            content: "update",
            likes: [1, 2, 3, 7, 8, 9],
            replies: [],
            files: [{ id: 1, filename: '1234.png' }, { id: 3, filename: '3.png' }],
            meetingId: 2,
            isHide: false,
            isAnswered: false,
            isApproved: true,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
            platform:{id: 2, name:'facebook'}
        }
        const obj = { questions: { 1: expectedObj }, questionsByMeetingId: { 2: [1] } };
        const updateSuccess:updateQuestion={
            questionId: 1,
            content: 'update',
            deleteFilesId:[2],
            files:[{ id: 1, filename: '1234.png' }, { id: 3, filename: '3.png' }],
            updatedAt: new Date(Date.now()+12345),
            isApproved:true
        }
        const finalState = questionsReducer(initialState, action.successfullyUpdateQuestion(updateSuccess));
        expect(finalState).toEqual(obj)
    });
    it("new reply to a question", () => {
        const initialState = {
            questions: { 1: question }, questionsByMeetingId: { 2: [1] }
        }
        const reply = {
            id: 1,
            guestId: 1,
            guestName: 'Anonymous',
            content: 'this is a reply',
            questionId: 1,
            isEdit: false,
            createdAt: new Date(Date.now()+123),
            updatedAt: new Date('2020-05-27T12:36:17.000Z'),
            isHide: false
        }

        const obj = { questions: { 1: {...question, replies:[reply]} }, questionsByMeetingId: { 2: [1] } };
        const finalState = questionsReducer(initialState, action.addedReplyToQuestion(reply));
        expect(finalState).toEqual(obj)
    });
    it("update reply", () => {
        const reply = {
            id: 1,
            guestId: 1,
            guestName: 'Anonymous',
            content: 'this is a reply',
            questionId: 1,
            isEdit: false,
            createdAt: new Date(Date.now()+123),
            updatedAt: expect.anything(),
            isHide: false
        }
        const initialState = {
            questions: { 2: {...question, id:2, replies:[reply]} }, questionsByMeetingId: { 2: [2] }
        }

        const obj = { questions: { 2: {...question, id:2, replies:[{...reply, updatedAt:expect.anything(), content:'update reply'}]} }, questionsByMeetingId: { 2: [2] } };
        const finalState = questionsReducer(initialState, action.successfullyUpdateReply(2,1,'update reply',new Date(Date.now()+999)));
        expect(finalState).toEqual(obj)
    });
    it("delete reply", () => {
        const reply = {
            id: 1,
            guestId: 1,
            guestName: 'Anonymous',
            content: 'this is a reply',
            questionId: 1,
            isEdit: false,
            createdAt: new Date(Date.now()+123),
            updatedAt: new Date(Date.now()+123),
            isHide: false
        }
        const initialState = {
            questions: { 1: {...question, replies:[reply]} }, questionsByMeetingId: { 2: [1] }
        }

        const obj = { questions: { 1: {...question,replies:[]} }, questionsByMeetingId: { 2: [1] } };
        const finalState = questionsReducer(initialState, action.successfullyDeleteReply(1,2));
        expect(finalState).toEqual(obj)
    });
    it("add vote to a question", () => {
        const initialState = {
            questions: { 1: question }, questionsByMeetingId: { 2: [1] }
        }
        const obj = { questions: { 1: {...question, likes:[1,2,3,7,8,9,10]} }, questionsByMeetingId: { 2: [1] } };
        const finalState = questionsReducer(initialState, action.successfullyVoteForAQuestion(1, 10));
        expect(finalState).toEqual(obj)
    });
    it("remove vote to a question", () => {
        const initialState = {
            questions: { 1: question }, questionsByMeetingId: { 2: [1] }
        }
        const obj = { questions: { 1: {...question, likes:[1,2,3,7,8]} }, questionsByMeetingId: { 2: [1] } };
        const finalState = questionsReducer(initialState, action.successfullyRemoveVote(1, 9));
        expect(finalState).toEqual(obj)
    });
    it("hide a reply", () => {
        const reply = {
            id: 1,
            guestId: 1,
            guestName: 'Anonymous',
            content: 'this is a reply',
            questionId: 1,
            isEdit: false,
            createdAt: new Date(Date.now()+123),
            updatedAt: new Date(Date.now()+123),
            isHide: false
        }
        const initialState = {
            questions: { 1: {...question, replies:[reply]} }, questionsByMeetingId: { 2: [1] }
        }

        const obj = { questions: { 1: {...question,replies:[{...reply,isHide:true}]} }, questionsByMeetingId: { 2: [1] } };
        const finalState = questionsReducer(initialState, action.successfullyHideOrDisplayAReply(1,1,true));
        expect(finalState).toEqual(obj)
    });
    it("hide a reply", () => {
        const reply = {
            id: 1,
            guestId: 1,
            guestName: 'Anonymous',
            content: 'this is a reply',
            questionId: 1,
            isEdit: false,
            createdAt: new Date(Date.now()+123),
            updatedAt: new Date(Date.now()+123),
            isHide: true
        }
        const initialState = {
            questions: { 1: {...question, replies:[reply]} }, questionsByMeetingId: { 2: [1] }
        }

        const obj = { questions: { 1: {...question,replies:[{...reply,isHide:false}]} }, questionsByMeetingId: { 2: [1] } };
        const finalState = questionsReducer(initialState, action.successfullyHideOrDisplayAReply(1,1,false));
        expect(finalState).toEqual(obj)
    });
    it("display a reply", () => {
        const reply = {
            id: 1,
            guestId: 1,
            guestName: 'Anonymous',
            content: 'this is a reply',
            questionId: 1,
            isEdit: false,
            createdAt: new Date(Date.now()+123),
            updatedAt: new Date(Date.now()+123),
            isHide: true
        }
        const initialState = {
            questions: { 1: {...question, replies:[reply]} }, questionsByMeetingId: { 2: [1] }
        }

        const obj = { questions: { 1: {...question,replies:[{...reply,isHide:false}]} }, questionsByMeetingId: { 2: [1] } };
        const finalState = questionsReducer(initialState, action.successfullyHideOrDisplayAReply(1,1,false));
        expect(finalState).toEqual(obj)
    });
    it("hide a question", () => {
        const initialState = {
            questions: { 1: question}, questionsByMeetingId: { 2: [1] }
        }
        const obj = { questions: { 1: {...question,isHide:true, isApproved:false} }, questionsByMeetingId: { 2: [1] } };
        const finalState = questionsReducer(initialState, action.successfullyApprovedOrHideAQuestion(1,true));
        expect(finalState).toEqual(obj)
    });
    it("display a question", () => {
        const initialState = {
            questions: { 1: {...question, isHide:true, isApproved:false}}, questionsByMeetingId: { 2: [1] }
        }
        const obj = { questions: { 1: {...question,isHide:false,isApproved:true} }, questionsByMeetingId: { 2: [1] } };
        const finalState = questionsReducer(initialState, action.successfullyApprovedOrHideAQuestion(1,false));
        expect(finalState).toEqual(obj)
    });
    it("answered a question", () => {
        const initialState = {
            questions: { 1: {...question, isAnswered:false}}, questionsByMeetingId: { 2: [1] }
        }
        const obj = { questions: { 1: {...question, isAnswered:true} }, questionsByMeetingId: { 2: [1] } };
        const finalState = questionsReducer(initialState, action.successfullyAnsweredQuestion(1));
        expect(finalState).toEqual(obj)
    });
});