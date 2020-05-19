import { ThunkDispatch, RootState } from "../../store";
import { loadQuestions, successfullyDeleteQuestion, successfullyUpdateQuestionPlainText, addedReplyToQuestion, successfullyUpdateReply, successfullyDeleteReply } from "./actions";
import { tFetchQuestions, tDeleteQuestionSuccess, tEditQuestionPlainTextSuccess, tNewReply, tUpdateReply, tDeleteReplySuccess } from "../../fakeResponse";


// Thunk Action
export function fetchQuestions(meetingId: number) {
    return async (dispatch: ThunkDispatch) => {
        try{
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions?meetingId=${meetingId}`, {
            //     credentials: "include"
            // }); // GET + 'memos'
            // const result = await res.json();
            const result = tFetchQuestions;
            if (result.status) {
                dispatch(loadQuestions(meetingId, result.message));
            } else {
                window.alert(result.message);
            }
        }catch(e){
           window.alert(e.message);
        }
    }
}
export function deleteQuestion(questionId: number, meetingId: number) {
    return async (dispatch: ThunkDispatch) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/${questionId}`, {
            //     method: 'DELETE',
            //     credentials: "include"
            // });
            // const result = await res.json();
            const result = tDeleteQuestionSuccess;
            if (result.status) {
                dispatch(successfullyDeleteQuestion(result.message.meetingId, result.message.questionId));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function editQuestionPlainText(questionId: number, content:string) {
    return async (dispatch: ThunkDispatch) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/${questionId}`, {
            //     method: 'PUT',
            //     credentials: "include",
            //     headers: {
            //         'Content-Type': 'application/json'
            //       },
            //       body: JSON.stringify({content})
            // });
            //const result = await res.json();
            const result = tEditQuestionPlainTextSuccess;
            if (result.status) {
                dispatch(successfullyUpdateQuestionPlainText(result.message.questionId, result.message.content));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function addReplyToQuestion(questionId:number, guestId:number, content:string) {
    return async (dispatch: ThunkDispatch) => {
        try{
        //    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/reply`, {
        //         method: 'POST',
        //         credentials: "include",
        //         headers: {
        //             'Content-Type': 'application/json'
        //           },
        //           body: JSON.stringify({content, questionId, guestId})
        //     });
        //     const result = await res.json();
            const result = tNewReply;
            if (result.status) {
                dispatch(addedReplyToQuestion(result.message));
            } else {
                window.alert(result.message);
            }
        }catch(e){
           window.alert(e.message);
        }
    }
}
export function editReply(questionId: number, replyId:number, content:string) {
    return async (dispatch: ThunkDispatch) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/reply`, {
            //     method: 'PUT',
            //     credentials: "include",
            //     headers: {
            //         'Content-Type': 'application/json'
            //       },
            //       body: JSON.stringify({questionId, replyId, content})
            // });
            //const result = await res.json();
            const result = tUpdateReply;
            if (result.status) {
                dispatch(successfullyUpdateReply(result.message.questionId, result.message.replyId, result.message.content));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function deleteReply(questionId: number, meetingId: number, replyId:number) {
    return async (dispatch: ThunkDispatch) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/${questionId}`, {
            //     method: 'DELETE',
            //     credentials: "include"
            // });
            // const result = await res.json();
            const result = tDeleteReplySuccess;
            if (result.status) {
                dispatch(successfullyDeleteReply(result.message.questionId, result.message.replyId, result.message.meetingId));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
