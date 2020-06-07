import { ReportActions } from "./actions";
import { IReportQuestion, IReportView } from "../../models/IReport";


export interface ReportState{
    questions:{
        [id:string]:IReportQuestion
    },
    questionsByMeetingId:{
        [meetingId: string]: number[]
    },
    views:{
        [id:string]:IReportView
    },
    viewsByMeetingId:{
        [meetingId: string]: number[]
    },
    questionsCountOfLatestMeetings:{meetingId:number, count:number, meetingName:string}[]
}

const initialState = {
    questions:{},
    questionsByMeetingId:{},
    views:{},
    viewsByMeetingId:{},
    questionsCountOfLatestMeetings:[]
}

export const reportReducer = (oldState: ReportState = initialState,action:ReportActions): ReportState => {
    switch (action.type) {
        case '@@REPORT/LOADED_QUESTIONS':
            // console.log(action.questions)
            const newQuestions = {...oldState.questions}
            const newQuestionsByMeetingId = {...oldState.questionsByMeetingId}
            for (let question of action.questions) {
                newQuestions[question.id] = question
                if (question.meetingid in newQuestionsByMeetingId){
                    newQuestionsByMeetingId[question.meetingid].push(question.id)
                }else{
                    newQuestionsByMeetingId[question.meetingid] = [question.id]
                }
            }
            
            return {
                ...oldState,
                questions: newQuestions,
                questionsByMeetingId: newQuestionsByMeetingId
            };
        case '@@REPORT/LOADED_VIEWS':
            const newViews = {...oldState.views} as any
            const neViewsByMeetingId = {...oldState.viewsByMeetingId} as any
            for (let view of action.views) {
                newViews[view.id] = view
                if (view.meetingid in neViewsByMeetingId){
                    neViewsByMeetingId[view.meetingid].push(view.id)
                }else{
                    neViewsByMeetingId[view.meetingid] = [view.id]
                }
            }
            
            return {
                ...oldState,
                views: newViews,
                viewsByMeetingId: neViewsByMeetingId
            };
        case '@@REPORT/LOADED_COUNT_LATEST_QUESTIONS':
            return {
                ...oldState,
                questionsCountOfLatestMeetings: action.questionsCount
            };
        
        default:
            return oldState;
    }
}