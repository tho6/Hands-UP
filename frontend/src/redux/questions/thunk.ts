import { ThunkDispatch, RootState } from "../../store";
import { loadQuestions, successfullyDeleteQuestion, successfullyUpdateQuestion, addedReplyToQuestion, successfullyUpdateReply, successfullyDeleteReply, successfullyVoteForAQuestion, successfullyRemoveVote } from "./actions";
import { tFetchQuestions, tDeleteQuestionSuccess, tEditQuestionSuccess, tNewReply, tUpdateReply, tDeleteReplySuccess, tAddedVote } from "../../fakeResponse";


// Thunk Action
export function fetchQuestions(meetingId: number) {
    return async (dispatch: ThunkDispatch) => {
        try {
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
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function deleteQuestion(questionId: number, meetingId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions`, {
            //     method: 'DELETE',
            //     credentials: "include",
            //     headers:{
            //         'Authorization': `Bearer ${getState().roomsInformation.userInformation.token}`,
            //         'Content-Type': 'application/json'
            //     },
            //     body:JSON.stringify({questionId, meetingId})
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
export function editQuestion(questionId: number, content: string, deleteFilesId: number[], fileList:FileList|null) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const formData = new FormData();
            formData.append('questionId', `${questionId}`);
            formData.append('content', content);
            formData.append('deleteFilesId', JSON.stringify(deleteFilesId));
            if (fileList !== null) {
               for(let i = 0; i<fileList.length; i++){
                   formData.append('images[]', fileList[i])
               }
            }
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions`, {
            //     method: 'PUT',
            //     credentials: "include",
            //     headers: {
            //         'Authorization': `Bearer ${getState().roomsInformation.userInformation.token}`,
            //         'Content-Type': 'application/json'
            //       },
            //       body: formData
            // });
            //const result = await res.json();
            const result = tEditQuestionSuccess;
            if (result.status) {
                dispatch(successfullyUpdateQuestion(result.message.questionId, result.message.content,result.message.deleteFilesId, result.message.files));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function addReplyToQuestion(questionId: number, guestId: number, content: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            //    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/reply`, {
            //         method: 'POST',
            //         credentials: "include",
            //         headers: {
            //             'Authorization': `Bearer ${getState().roomsInformation.userInformation.token}`,
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
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function editReply(questionId: number, replyId: number, content: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/reply`, {
            //     method: 'PUT',
            //     credentials: "include",
            //     headers: {
            //         'Authorization': `Bearer ${getState().roomsInformation.userInformation.token}`,
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
export function deleteReply(questionId: number, meetingId: number, replyId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/reply`, {
            //     method: 'DELETE',
            //     credentials: "include",
            //     headers: {
            //         'Authorization': `Bearer ${getState().roomsInformation.userInformation.token}`,
            //         'Content-Type': 'application/json'
            //       },
            //       body: JSON.stringify({meetingId, questionId, replyId})
            // });
            //const result = await res.json();
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
export function addVote(guestId: number, questionId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/likes`, {
            //     method: 'POST',
            //     credentials: "include",
            //     headers: {
            //         'Authorization': `Bearer ${getState().roomsInformation.userInformation.token}`,
            //         'Content-Type': 'application/json'
            //       },
            //       body: JSON.stringify({guestId, questionId})
            // });
            //const result = await res.json();
            const result = tAddedVote;
            if (result.status) {
                dispatch(successfullyVoteForAQuestion(result.message.questionId, result.message.guestId));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
export function removeVote(guestId: number, questionId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/likes`, {
            //     method: 'DELETE',
            //     credentials: "include",
            //     headers: {
            //         'Authorization': `Bearer ${getState().roomsInformation.userInformation.token}`,
            //         'Content-Type': 'application/json'
            //       },
            //       body: JSON.stringify({guestId, questionId})
            // });
            //const result = await res.json();
            const result = tAddedVote;
            if (result.status) {
                dispatch(successfullyRemoveVote(result.message.questionId, result.message.guestId));
            } else {
                window.alert(result.message);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }
}
