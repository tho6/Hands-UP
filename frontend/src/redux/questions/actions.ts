import { IQuestion } from "../../models/IQuestion";

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
export function successfullyUpdateQuestionPlainText(questionId:number, content:string) {
    return {
        type: '@@QUESTIONS/UPDATE_QUESTION_PLAINTEXT' as '@@QUESTIONS/UPDATE_QUESTION_PLAINTEXT',
        questionId,
        content
    }
}

// action types
export type QuestionsActions = ReturnType<typeof loadQuestions>|ReturnType<typeof successfullyDeleteQuestion>|ReturnType<typeof successfullyUpdateQuestionPlainText>;