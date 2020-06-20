import { QuestionsActions } from "./actions"
import { IQuestion } from "../../models/IQuestion";
// import { routerActions } from "connected-react-router";


export interface QuestionState {
    questions: {
        [id: string]: IQuestion
    },
    questionsByMeetingId: {
        [id: string]: number[]
    }
}
// immutability

const initialState: QuestionState = {
    questions: {},
    questionsByMeetingId: {}
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
                const newArray = { ...oldState.questionsByMeetingId }[action.meetingId].filter(id => id !== action.questionId)
                const newQuestionsByMeetingId = { ...oldState.questionsByMeetingId };
                newQuestionsByMeetingId[action.meetingId] = newArray;

                return {
                    ...oldState,
                    questions: newQuestions,
                    questionsByMeetingId: newQuestionsByMeetingId
                };
            }
        case '@@QUESTIONS/UPDATE_QUESTION':
            {
                const newQuestions = { ...oldState.questions };
                // newQuestions[action.questionId] = {
                //     ...newQuestions[action.questionId],
                //     content: action.content,
                //     files: action.files,
                //     updatedAt: action.updatedAt,
                //     isApproved: action.isApproved
                // }
                newQuestions[action.questionId].content = action.content;
                //const newFiles = [...oldState.questions[action.questionId].files].filter(file => !action.deleteFilesId.includes(file.id));
                const newFiles = action.files
                newQuestions[action.questionId].files = newFiles;
                newQuestions[action.questionId].updatedAt = action.updatedAt;
                newQuestions[action.questionId].isApproved = action.isApproved;
                return {
                    ...oldState,
                    questions: newQuestions,
                };
            }
        case '@@QUESTIONS/ADDED_REPLY_TO_QUESTION':
            {
                const newQuestions = { ...oldState.questions };
                const replyArr = oldState.questions[action.reply.questionId].replies.slice();
                replyArr.push(action.reply);
                newQuestions[action.reply.questionId].replies = replyArr;

                return {
                    ...oldState,
                    questions: newQuestions,
                };
            }
        case '@@QUESTIONS/UPDATED_REPLY':
            {
                const newQuestions = { ...oldState.questions };
                const replyArr = oldState.questions[action.reply.questionId].replies.slice();
                const idx = replyArr.findIndex(elem => elem.id === action.reply.replyId);
                replyArr[idx].content = action.reply.content;
                replyArr[idx].updatedAt = action.reply.updatedAt;
                newQuestions[action.reply.questionId].replies = replyArr;

                return {
                    ...oldState,
                    questions: newQuestions,
                };
            }
        case '@@QUESTIONS/DELETED_REPLY':
            {
                const newQuestions = { ...oldState.questions };
                const replyArr = oldState.questions[action.reply.questionId].replies.slice();
                const idx = replyArr.findIndex(elem => elem.id === action.reply.replyId);
                replyArr.splice(idx, 1);
                console.log(replyArr);
                newQuestions[action.reply.questionId].replies = replyArr;
                return {
                    ...oldState,
                    questions: newQuestions
                };
            }
        case '@@QUESTIONS/ADDED_VOTE':
            {
                const newQuestions = { ...oldState.questions };
                const likesArr = oldState.questions[action.vote.questionId].likes.slice();
                likesArr.push(action.vote.guestId);
                newQuestions[action.vote.questionId].likes = likesArr;
                return {
                    ...oldState,
                    questions: newQuestions
                };
            }
        case '@@QUESTIONS/REMOVED_VOTE':
            {
                const newQuestions = { ...oldState.questions };
                const likesArr = oldState.questions[action.vote.questionId].likes.filter(id => id !== action.vote.guestId);
                newQuestions[action.vote.questionId].likes = likesArr;
                return {
                    ...oldState,
                    questions: newQuestions
                };
            }
        case '@@QUESTIONS/ADDED_QUESTION':
            {
                const newQuestions = { ...oldState.questions };
                newQuestions[action.question.id]=action.question;
                const newQuestionsByMeetingId = { ...oldState.questionsByMeetingId };
              // const newArr =  oldState.questionsByMeetingId[action.question.meetingId]?[...oldState.questionsByMeetingId[action.question.meetingId]]:[];
                const newArr =  oldState.questionsByMeetingId[action.question.meetingId]||[];
                newArr.push(action.question.id);
                newQuestionsByMeetingId[action.question.meetingId] = newArr

                return {
                    ...oldState,
                    questions: newQuestions,
                    questionsByMeetingId: newQuestionsByMeetingId
                };
            }
            case '@@QUESTIONS/HIDE_OR_DISPLAY_REPLY':
                {
                    const newQuestions = { ...oldState.questions };
                    const replyArr = oldState.questions[action.questionId].replies.slice();
                    const idx = replyArr.findIndex(elem => elem.id === action.replyId);
                    replyArr[idx].isHide = action.isHide;
                    newQuestions[action.questionId].replies = replyArr;
    
                    return {
                        ...oldState,
                        questions: newQuestions,
                    };
                }
                case '@@QUESTIONS/APPROVE_HIDE_QUESTION':
                    {
                        const newQuestions = { ...oldState.questions };
                        if(action.isHide === true){
                            newQuestions[action.questionId].isHide = true;
                            newQuestions[action.questionId].isApproved = false;
                        }else{
                            newQuestions[action.questionId].isHide = false;
                            newQuestions[action.questionId].isApproved = true;
                        }
                        return {
                            ...oldState,
                            questions: newQuestions,
                        };
                    }
                    case '@@QUESTIONS/ANSWERED_QUESTION':
                        {
                            const newQuestions = { ...oldState.questions };
                            newQuestions[action.questionId].isAnswered = true;
                            return {
                                ...oldState,
                                questions: newQuestions,
                            };
                        }
        default:
            return oldState;
    }
}
