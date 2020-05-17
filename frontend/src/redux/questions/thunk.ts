import { ThunkDispatch, RootState } from "../../store";
import { loadQuestions, successfullyDeleteQuestion, successfullyUpdateQuestionPlainText } from "./actions";

// Thunk Action
export function fetchQuestions(meetingId: number) {
    return async (dispatch: ThunkDispatch) => {
        try{
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions?meetingId=${meetingId}`, {
                credentials: "include"
            }); // GET + 'memos'
            const result = await res.json();
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
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/${questionId}`, {
                method: 'DELETE',
                credentials: "include"
            });
            const result = await res.json();
            if (result.status) {
                dispatch(successfullyDeleteQuestion(questionId, meetingId));
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
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/${questionId}`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({content})
            });
            const result = await res.json();
            if (result.status) {
                dispatch(successfullyUpdateQuestionPlainText(questionId, content));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}