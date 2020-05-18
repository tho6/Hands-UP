import { QuestionsActions } from "./actions"
import { IQuestion } from "../../models/IQuestion";
import { routerActions } from "connected-react-router";


export interface QuestionState {
    questions: {
        [id: string]: IQuestion
    },
    questionsByMeetingId: {
        [id: string]: number[]
    }
}
const question: IQuestion = {
    id: 1,
    questioner: {
        name: 'Anonymous',
        id: 1,
        isHost: false
    },
    content: "Hi how are you? akjdfk kjsadkj hakjdk jkshdkj kjadskjk akjdhkj kahdskj akdsjhkajsd aksjdhkj sdkjahskd aksjdka sdkjaskd askjd kjss dkjfkdf jdfkjshfahdjfahdljfk hwif sjdhf kajhsdfklhdfkjahsdkjfha kdfhakjshdf sjhdfkjasd fkjahsd kfha ksjdfh kashdjf lakjshdfkahskdjfhak dfhlaks fkah dfk",
    likes: 10,
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    files: [],
    meetingId: 1,
    isHide: false,
    isAnswered: false,
    isModerate: false
}

// immutability

const initialState: QuestionState = {
    questions: { 1: question },
    questionsByMeetingId: { 1: [1] }
}

export const questionsReducer = /* reducer */ (oldState = initialState, action: QuestionsActions) => {
    switch (action.type) {
        case '@@QUESTIONS/LOADED_QUESTIONS':
            {
                const newQuestions = { ...oldState.questions };

                for (let question of action.questions) {
                    newQuestions[question.id] = question
                }

                const newQuestionsByMeetingId = { ...oldState.questionsByMeetingId }
                newQuestionsByMeetingId[action.meetingId] = action.questions.map(question => question.id)

                return {
                    ...oldState,
                    questions: newQuestions,
                    questionsByMeetingId: newQuestionsByMeetingId
                };
            }
            case '@@QUESTIONS/DELETE_QUESTION':
                {
                    const newQuestions = { ...oldState.questions };
                    delete newQuestions[action.questionId]
                    const newArray = { ...oldState.questionsByMeetingId }[action.meetingId].filter(id=>id!=action.questionId)
                    const newQuestionsByMeetingId = { ...oldState.questionsByMeetingId };
                    newQuestionsByMeetingId[action.meetingId] = newArray;
    
                    return {
                        ...oldState,
                        questions: newQuestions,
                        questionsByMeetingId: newQuestionsByMeetingId
                    };
                }
            case '@@QUESTIONS/UPDATE_QUESTION_PLAINTEXT':
                {
                    const newQuestions = { ...oldState.questions };
                     newQuestions[action.questionId].content = action.content;
                    return {
                        ...oldState,
                        questions: newQuestions,
                    };
                }
        default:
            return oldState;
    }
}
