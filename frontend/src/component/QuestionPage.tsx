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
  const [formState, { textarea }] = useFormState();
  const [files, setFiles] = useState<FileList | null>(null);
  const [isQuestion, setIsQuestion] = useState(true);
  const dispatch = useDispatch();
  let answering: IQuestion;
  let questionsNeedToBeApproved: IQuestion[] = [];
  useEffect(() => {
    dispatch(fetchRoomInformation(parseInt(meetingId)));
  }, [dispatch, meetingId]);

  useEffect(() => {
    dispatch(restoreLoginInRoom(parseInt(meetingId)));
  }, [dispatch, meetingId]);
  useEffect(() => {
    dispatch(fetchQuestions(parseInt(meetingId)));
  }, [dispatch, meetingId]);

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
    if (
      roomInformation.canModerate &&
      roomInformation.userInformation?.isHost
    ) {
      questionsNeedToBeApproved = questions
        .slice()
        .sort((a, b) => a.updatedAt - b.updatedAt)
        .filter(
          (question) =>
            question.isApproved === false && question.isHide !== true
        );
    }
  }

  return (
    <div className="p-1 p-sm-2 p-md-3 p-lg-4 p-xl-5">
      <div className="question-moderation bottom-border pb-3 d-flex">
        <div>
          <button
            className={`util-spacing rounded ${isQuestion && 'is-active'}`}
            onClick={() => {
              setIsQuestion(true);
            }}
          >
            QUESTIONS
          </button>
        </div>
        {roomInformation?.canModerate &&
          roomInformation.userInformation?.isHost && (
            <div>
              <button
                className={`util-spacing rounded ${!isQuestion && 'is-active'}`}
                data-testid="moderate-button"
                onClick={() => {
                  setIsQuestion(false);
                }}
              >
                MODERATION{' '}
                {questionsNeedToBeApproved.length > 0
                  ? `(${questionsNeedToBeApproved.length})`
                  : ''}
              </button>
            </div>
          )}
      </div>
      {isQuestion && (
        <>
          <div className="question-form text-left mb-4">
            <div className="d-flex flex-wrap">
              <div className="flex-grow-1 text-area-container p-2">
                {isQuestion && (
                  <textarea
                    {...textarea('question')}
                    placeholder="What's on your mind?"
                    data-testid='textarea-new-question'
                  ></textarea>
                )}
              </div>
              <div className="d-flex align-items-end">
                {isQuestion && (
                  <>
                    <div
                      className="util-spacing will-hover"
                      onClick={() => {
                        if (!formState.values.question.trim()) {
                          window.alert('Empty question is not allowed!');
                          return;
                        }
                        if (files?.length !== undefined && files.length > 3) {
                          window.alert(
                            'Maximum of three images for each question!'
                          );
                          setFiles(null);
                          return;
                        }
                        dispatch(
                          addQuestion(
                            parseInt(meetingId),
                            formState.values.question,
                            files
                          )
                        );
                        formState.setField('question', '');
                        setFiles(null);
                      }}
                    >
                      <i className="fas fa-paper-plane"></i>
                    </div>
                    {roomInformation?.canUploadFiles && (
                      <div className="util-spacing will-hover">
                        <label htmlFor="q-img" className="mb-0">
                          <i className="fas fa-camera"></i> (max:3):
                        </label>
                        {files == null
                          ? 'No files'
                          : `${files.length} ${
                              files.length > 1 ? 'files' : 'file'
                            }`}
                        <input
                          className="d-none"
                          id="q-img"
                          type="file"
                          onChange={(event) =>
                            setFiles(event.currentTarget.files)
                          }
                          multiple
                          accept="image/*"
                        />
                      </div>
                    )}
                  </>
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
                  !question.isHide && !question.isAnswered && question.isApproved && (
                    <Question
                      key={question.id}
                      user={roomInformation.userInformation}
                      canUploadFiles={roomInformation.canUploadFiles}
                      question={question}
                      answering={answering.id === question.id ? true : false}
                      isModerate={false}
                    />
                  )
                );
              })}
            {page === 'answered' &&
              questions?.map((question, i) => {
                return (
                  !question.isHide && question.isAnswered && (
                    <Question
                      key={question.id}
                      user={roomInformation.userInformation}
                      canUploadFiles={roomInformation.canUploadFiles}
                      question={question}
                      answering={false}
                      isModerate={false}
                    />
                  )
                );
              })}
          </div>
        </>
      )}
      {roomInformation?.canModerate &&
        !isQuestion &&
        questionsNeedToBeApproved.length > 0 &&
        questionsNeedToBeApproved.map((question) => {
          return (
            <div className="moderate-container" data-testid='moderate-questions'>
              <Question
                key={`${question.id}`}
                user={roomInformation.userInformation}
                canUploadFiles={roomInformation.canUploadFiles}
                question={question}
                answering={false}
                isModerate={true}
              />
            </div>
          );
        })}

      {roomInformation?.canModerate &&
        !isQuestion &&
        questionsNeedToBeApproved.length === 0 && (
          <div className="moderate-container" data-testid='no-moderate-questions'>
            No questions need to be approved
          </div>
        )}
    </div>
  );
};

export default QuestionPage;
