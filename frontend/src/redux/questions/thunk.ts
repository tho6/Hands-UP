import { ThunkDispatch, RootState } from "../../store";
import { loadQuestions } from "./actions";
import { setQuestionLimitState } from "../rooms/actions";


// Thunk Action
export function fetchQuestions(meetingId: number) {
    return async (dispatch: ThunkDispatch, getState:()=>RootState) => {
        try {
            console.log('hi');
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${meetingId}/questions`,{
            headers: {
                'Authorization': `Bearer ${getState().auth.accessToken}`,
            }}); // GET + 'memos'
            const result = await res.json();
            console.log(result);
            if (result.status) {
                dispatch(loadQuestions(meetingId, result.message));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function addQuestion(meetingId: number, content: string, fileList: FileList | null) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        if ((getState().roomsInformation.questionLimitStatus[meetingId]?.count) >= getState().roomsInformation.roomsInformation[meetingId].questionLimit) {
            window.alert('You cannot ask too many questions within a period');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('content', content);
            if (fileList !== null) {
                for (let i = 0; i < fileList.length; i++) {
                    formData.append('images[]', fileList[i])
                }
            }
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${meetingId}/questions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                },
                body: formData
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
            if (!getState().roomsInformation.questionLimitStatus[meetingId]?.isChecking) {
                setTimeout(() => {
                    dispatch(setQuestionLimitState(meetingId, false))
                }, 10000);
            }
            dispatch(setQuestionLimitState(meetingId, true));
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function deleteQuestion(questionId: number, meetingId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/questions/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function editQuestion(questionId: number, content: string, deleteFilesId: number[], fileList: FileList | null) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('deleteFilesId', JSON.stringify(deleteFilesId));
            if (fileList !== null) {
                for (let i = 0; i < fileList.length; i++) {
                    formData.append('images[]', fileList[i])
                }
            }
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/questions/${questionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                },
                body: formData
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function addReplyToQuestion(questionId: number, content: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/questions/${questionId}/reply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function editReply(questionId: number, replyId: number, content: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/questions/reply/${replyId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function deleteReply(questionId: number, meetingId: number, replyId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/questions/reply/${replyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                },
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function addVote(questionId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        console.log('add');
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/questions/${questionId}/vote`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function removeVote(questionId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/questions/${questionId}/votef`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function hideOrDisplayReply(replyId: number, isHide: boolean) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/questions/reply/${replyId}/hide`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isHide })
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function approveOrHideQuestion(questionId: number, isHide: boolean) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/questions/${questionId}/hide`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isHide })
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function answeredQuestion(questionId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/questions/${questionId}/answered`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await res.json();
            if (!result.status) {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
