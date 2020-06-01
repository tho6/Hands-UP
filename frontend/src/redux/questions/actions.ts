import { IQuestion, reply, updateQuestion } from "../../models/IQuestion";

// action creator
export function loadQuestions(meetingId: number, questions: IQuestion[]) {
    return {
        type: '@@QUESTIONS/LOADED_QUESTIONS' as '@@QUESTIONS/LOADED_QUESTIONS',
        questions,
        meetingId
    }
}
export function successfullyDeleteQuestion(questionId: number, meetingId: number) {
    return {
        type: '@@QUESTIONS/DELETE_QUESTION' as '@@QUESTIONS/DELETE_QUESTION',
        questionId,
        meetingId
    }
}
export function successfullyUpdateQuestion(question: updateQuestion) {
    const {questionId, content, deleteFilesId, files, updatedAt, isApproved} = question
    return {
        type: '@@QUESTIONS/UPDATE_QUESTION' as '@@QUESTIONS/UPDATE_QUESTION',
        questionId,
        content,
        deleteFilesId,
        files,
        updatedAt,
        isApproved
}
}
export function addedReplyToQuestion(reply: reply) {
    return {
        type: '@@QUESTIONS/ADDED_REPLY_TO_QUESTION' as '@@QUESTIONS/ADDED_REPLY_TO_QUESTION',
        reply
    }
}
export function successfullyUpdateReply(questionId: number, replyId: number, content: string, updatedAt: Date) {
    return {
        type: '@@QUESTIONS/UPDATED_REPLY' as '@@QUESTIONS/UPDATED_REPLY',
        reply: { questionId, replyId, content, updatedAt }
    }
}
export function successfullyDeleteReply(questionId: number, replyId: number) {
    return {
        type: '@@QUESTIONS/DELETED_REPLY' as '@@QUESTIONS/DELETED_REPLY',
        reply: { questionId, replyId }
    }
}
export function successfullyVoteForAQuestion(questionId: number, guestId: number) {
    return {
        type: '@@QUESTIONS/ADDED_VOTE' as '@@QUESTIONS/ADDED_VOTE',
        vote: { questionId, guestId }
    }
}
export function successfullyRemoveVote(questionId: number, guestId: number) {
    return {
        type: '@@QUESTIONS/REMOVED_VOTE' as '@@QUESTIONS/REMOVED_VOTE',
        vote: { questionId, guestId }
    }
}
export function addedQuestion(question: IQuestion) {
    return {
        type: '@@QUESTIONS/ADDED_QUESTION' as '@@QUESTIONS/ADDED_QUESTION',
        question
    }
}
export function successfullyHideOrDisplayAReply(replyId: number, questionId: number, isHide: boolean) {
    return {
        type: '@@QUESTIONS/HIDE_OR_DISPLAY_REPLY' as '@@QUESTIONS/HIDE_OR_DISPLAY_REPLY',
        questionId,
        replyId,
        isHide
    }
}
export function successfullyApprovedOrHideAQuestion(questionId: number, isHide: boolean) {
    return {
        type: '@@QUESTIONS/APPROVE_HIDE_QUESTION' as '@@QUESTIONS/APPROVE_HIDE_QUESTION',
        questionId,
        isHide
    }
}
export function successfullyAnsweredQuestion(questionId: number) {
    return {
        type: '@@QUESTIONS/ANSWERED_QUESTION' as '@@QUESTIONS/ANSWERED_QUESTION',
        questionId,
    }
}



// action types
export type QuestionsActions = ReturnType<typeof loadQuestions> | ReturnType<typeof successfullyDeleteQuestion> | ReturnType<typeof successfullyUpdateQuestion> |
    ReturnType<typeof addedReplyToQuestion> | ReturnType<typeof successfullyUpdateReply> | ReturnType<typeof successfullyDeleteReply> | ReturnType<typeof successfullyVoteForAQuestion> |
    ReturnType<typeof successfullyRemoveVote> | ReturnType<typeof addedQuestion> | ReturnType<typeof successfullyApprovedOrHideAQuestion> |
    ReturnType<typeof successfullyHideOrDisplayAReply> | ReturnType<typeof successfullyAnsweredQuestion>;