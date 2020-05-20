import { IQuestion, reply, file } from "../../models/IQuestion";

// action creator
export function loadQuestions(meetingId: number, questions: IQuestion[]) {
    return {
        type: '@@QUESTIONS/LOADED_QUESTIONS' as '@@QUESTIONS/LOADED_QUESTIONS',
        questions,
        meetingId
    }
}
export function successfullyDeleteQuestion(questionId:number, meetingId:number) {
    return {
        type: '@@QUESTIONS/DELETE_QUESTION' as '@@QUESTIONS/DELETE_QUESTION',
        questionId,
        meetingId
    }
}
export function successfullyUpdateQuestion(questionId:number, content:string, deleteFilesId:number[], files:file[], updatedAt:number) {
    return {
        type: '@@QUESTIONS/UPDATE_QUESTION' as '@@QUESTIONS/UPDATE_QUESTION',
        questionId,
        content,
        deleteFilesId,
        files,
        updatedAt
    }
}
export function addedReplyToQuestion(reply:reply) {
    return {
        type: '@@QUESTIONS/ADDED_REPLY_TO_QUESTION' as '@@QUESTIONS/ADDED_REPLY_TO_QUESTION',
        reply
    }
}
export function successfullyUpdateReply(questionId:number, replyId:number, content:string, updatedAt:number) {
    return {
        type: '@@QUESTIONS/UPDATED_REPLY' as '@@QUESTIONS/UPDATED_REPLY',
        reply:{questionId, replyId, content, updatedAt}
    }
}
export function successfullyDeleteReply(questionId:number, replyId:number, meetingId:number) {
    return {
        type: '@@QUESTIONS/DELETED_REPLY' as '@@QUESTIONS/DELETED_REPLY',
        reply:{questionId, replyId, meetingId}
    }
}
export function successfullyVoteForAQuestion(questionId:number, guestId:number) {
    return {
        type: '@@QUESTIONS/ADDED_VOTE' as '@@QUESTIONS/ADDED_VOTE',
        vote:{questionId, guestId}
    }
}
export function successfullyRemoveVote(questionId:number, guestId:number) {
    return {
        type: '@@QUESTIONS/REMOVED_VOTE' as '@@QUESTIONS/REMOVED_VOTE',
        vote:{questionId, guestId}
    }
}
export function addedQuestion(question:IQuestion) {
    return {
        type: '@@QUESTIONS/ADDED_QUESTION' as '@@QUESTIONS/ADDED_QUESTION',
        question
    }
}

// action types
export type QuestionsActions = ReturnType<typeof loadQuestions>|ReturnType<typeof successfullyDeleteQuestion>|ReturnType<typeof successfullyUpdateQuestion>|
ReturnType<typeof addedReplyToQuestion>|ReturnType<typeof successfullyUpdateReply>|ReturnType<typeof successfullyDeleteReply>|ReturnType<typeof successfullyVoteForAQuestion>|
ReturnType<typeof successfullyRemoveVote>|ReturnType<typeof addedQuestion>;