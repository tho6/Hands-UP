import { ReportActions } from "./actions";
import { IReportQuestion, IReportView } from "../../models/IReport";


export interface ReportState {
    questions: {
        [id: string]: IReportQuestion
    },
    questionsByMeetingId: {
        [meetingId: string]: number[]
    },
    views: {
        [id: string]: IReportView
    },
    viewsByMeetingId: {
        [meetingId: string]: number[]
    },
    questionsCountOfLatestMeetings: { meetingId: number, count: number, meetingName: string, youtubePeakViews: number, facebookPeakViews: number, handsupPeakViews: number }[]
}

const initialState = {
    questions: {},
    questionsByMeetingId: {},
    views: {},
    viewsByMeetingId: {},
    questionsCountOfLatestMeetings: []
}

export const reportReducer = (oldState: ReportState = initialState, action: ReportActions): ReportState => {
    switch (action.type) {
        case '@@REPORT/LOADED_QUESTIONS':
            // console.log(action.questions)
            const quesMap = {} as any
            const newQuestions = { ...oldState.questions }
            const newQuestionsByMeetingId = { ...oldState.questionsByMeetingId }
            for (let question of action.questions) {
                newQuestions[question.id] = question
                if (question.meetingid in newQuestionsByMeetingId && question.meetingid in quesMap) {
                    newQuestionsByMeetingId[question.meetingid].push(question.id)

                } else if (question.meetingid in newQuestionsByMeetingId && !(question.meetingid in quesMap)) {
                    quesMap[question.meetingid] = true
                    newQuestionsByMeetingId[question.meetingid] = [question.id]
                }
                else {
                    quesMap[question.meetingid] = true
                    newQuestionsByMeetingId[question.meetingid] = [question.id]
                }
            }

            return {
                ...oldState,
                questions: newQuestions,
                questionsByMeetingId: newQuestionsByMeetingId
            };
        case '@@REPORT/LOADED_VIEWS':
            const viewMap = {} as any
            const newViews = { ...oldState.views }
            const newViewsByMeetingId = { ...oldState.viewsByMeetingId }
            for (let view of action.views) {
                newViews[view.id] = view
                if (view.meetingid in newViewsByMeetingId && view.meetingid in viewMap) {
                    newViewsByMeetingId[view.meetingid].push(view.id)

                } else if (view.meetingid in newViewsByMeetingId && !(view.meetingid in viewMap)) {
                    viewMap[view.meetingid] = true
                    newViewsByMeetingId[view.meetingid] = [view.id]
                }
                else {
                    viewMap[view.meetingid] = true
                    newViewsByMeetingId[view.meetingid] = [view.id]
                }
            }

            return {
                ...oldState,
                views: newViews,
                viewsByMeetingId: newViewsByMeetingId
            };
        case '@@REPORT/LOADED_COUNT_LATEST_QUESTIONS':
            return {
                ...oldState,
                questionsCountOfLatestMeetings: action.questionsCount
            };
        case '@@REPORT/DELETE_MEETINGS':
            const newQuestionsByMeetingIdforDel = { ...oldState.questionsByMeetingId }
            const newViewsByMeetingIdforDel = { ...oldState.viewsByMeetingId }
            delete newQuestionsByMeetingIdforDel[`${action.meetingId}`]
            delete newViewsByMeetingIdforDel[`${action.meetingId}`]
            return {
                ...oldState,
                questionsByMeetingId: newQuestionsByMeetingIdforDel,
                viewsByMeetingId: newViewsByMeetingIdforDel
            }

        default:
            return oldState;
    }
}