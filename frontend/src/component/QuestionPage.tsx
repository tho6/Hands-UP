import React, { useState, useEffect } from 'react';
import { IQuestion } from '../models/IQuestion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import useReactRouter from 'use-react-router';
import Question from './Question';
import { fetchRoomInformation, restoreLoginInRoom } from '../redux/rooms/thunk';
import { fetchQuestions, addQuestion } from '../redux/questions/thunk';
import { push } from 'connected-react-router';
import { useFormState } from 'react-use-form-state';

const QuestionPage: React.FC = () => {
  const router = useReactRouter<{ id: string; page: string }>();
  const meetingId = router.match.params.id;
  const page = router.match.params.page;
  const questionIds = useSelector(
    (rootState: RootState) =>
      rootState.questions.questionsByMeetingId[meetingId]
  );
  const questions = useSelector((rootState: RootState) =>
    questionIds?.map((id) => rootState.questions.questions[`${id}`])
  );
  const roomInformation = useSelector(
    (rootState: RootState) =>
      rootState.roomsInformation.roomsInformation[meetingId]
  );
  const userInformation = useSelector(
    (rootState: RootState) => rootState.roomsInformation.userInformation
  );
  const [formState, { textarea }] = useFormState();
  const [files, setFiles] = useState<FileList | null>(null);
  const dispatch = useDispatch();
  let answering:IQuestion;
  useEffect(() => {
    dispatch(fetchRoomInformation(parseInt(meetingId)));
  }, [dispatch, roomInformation, meetingId]);

  useEffect(() => {
    dispatch(restoreLoginInRoom(parseInt(meetingId), true));
  }, [dispatch, meetingId]);
  useEffect(() => {
    dispatch(fetchQuestions(parseInt(meetingId)));
  }, [dispatch, meetingId]);
  // useEffect(() => {
  //   if(questions){
  //     if(page === 'main' || page === 'answered'){
  //       questionsArr.sort((a,b)=>b.likes.length-a.likes.length);
  //     }else if(page === 'latest'){
  //       questionsArr.sort((a,b)=>b.updatedAt-a.updatedAt)
  //     }
  //   }
  // }, [page, questions])
  if (questions) {
    if (page === 'main' || page === 'answered') {
      questions.sort((a, b) => b.likes.length - a.likes.length);
      answering = questions[0];
    } else if (page === 'latest') {
     const arr = questions.slice();
      arr.sort((a, b) => b.likes.length - a.likes.length);
      answering = arr[0];
      questions.sort((a, b) => b.updatedAt - a.updatedAt);
    }
  }

  return (
    <div className="p-1 p-sm-2 p-md-3 p-lg-4 p-xl-5">
      <div className="question-form text-left mb-4">
        <div className="bottom-border pb-3">NEW QUESTIONS</div>
        <div className="d-flex flex-wrap">
          <div className="flex-grow-1 text-area-container p-2">
            <textarea
              {...textarea('question')}
              placeholder="What's on your mind?"
            ></textarea>
          </div>
          <div className="d-flex align-items-end">
            <div className="util-spacing will-hover" onClick={() => {
              if(!formState.values.question.trim()){
                window.alert('Empty question is not allowed!');
                return;
              }
              if(files?.length!==undefined && files.length>3){
                window.alert('Maximum of three images for each question!');
                setFiles(null);
                return;
              }
              dispatch(addQuestion(parseInt(meetingId), formState.values.question, files))
              formState.setField('question', '');
              setFiles(null);
            }}>
              <i className="fas fa-paper-plane"></i>
            </div>
            {roomInformation?.canUploadFiles && (
              <div className="util-spacing will-hover">
                <label htmlFor="q-img" className="mb-0">
                  <i className="fas fa-camera"></i> (max:3):
                </label>
                {files == null
                  ? 'No files'
                  : `${files.length} ${files.length > 1 ? 'files' : 'file'}`}
                <input
                  className="d-none"
                  id="q-img"
                  type="file"
                  onChange={(event) => setFiles(event.currentTarget.files)}
                  multiple
                  accept="image/*"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-left mb-4 d-flex">
        <button
          className={`util-spacing will-hover rounded question-page-tab ${
            page === 'main' && 'is-active'
          }`}
          onClick={() => {
            dispatch(push(`/questions/room/${meetingId}/main`));
          }}
        >
          Most Popular Questions
        </button>
        <button
          className={`util-spacing will-hover rounded question-page-tab ${
            page === 'latest' && 'is-active'
          }`}
          onClick={() => {
            dispatch(push(`/questions/room/${meetingId}/latest`));
          }}
        >
          Latest Questions
        </button>
        <button
          className={`util-spacing will-hover rounded question-page-tab ${
            page === 'answered' && 'is-active'
          }`}
          onClick={() => {
            dispatch(push(`/questions/room/${meetingId}/answered`));
          }}
        >
          Answered Questions
        </button>
      </div>
      <div>
        {page !== 'answered' &&
          questions?.map((question) => {
            return (
              !question.isAnswered && (
                <Question
                  key={question.id}
                  user={userInformation.user}
                  canUploadFiles={roomInformation.canUploadFiles}
                  question={question}
                  answering={answering.id === question.id? true : false}
                />
              )
            );
          })}
        {page === 'answered' &&
          questions?.map((question, i) => {
            return (
              question.isAnswered && (
                <Question
                  key={question.id}
                  user={userInformation.user}
                  canUploadFiles={roomInformation.canUploadFiles}
                  question={question}
                  answering={false}
                />
              )
            );
          })}
      </div>
    </div>
  );
};

export default QuestionPage;
