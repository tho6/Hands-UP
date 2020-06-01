import React, { useState, useEffect } from 'react';
import {
  IQuestion,
  reply,
  updateQuestion,
  updateReply
} from '../models/IQuestion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import useReactRouter from 'use-react-router';
import Question from './Question';
import {
  fetchRoomInformation,
  toggleYoutubeLiveStatus,
  getLiveStatus
} from '../redux/rooms/thunk';
import { fetchQuestions, addQuestion } from '../redux/questions/thunk';
import { push } from 'connected-react-router';
import { useFormState } from 'react-use-form-state';
import Reply from './Reply';
import { socket } from '../socket';
import {
  addedQuestion,
  successfullyUpdateQuestion,
  successfullyDeleteQuestion,
  successfullyVoteForAQuestion,
  successfullyRemoveVote,
  successfullyAnsweredQuestion,
  successfullyApprovedOrHideAQuestion,
  successfullyUpdateReply,
  addedReplyToQuestion,
  successfullyDeleteReply,
  successfullyHideOrDisplayAReply
} from '../redux/questions/actions';
import FlipMove from 'react-flip-move';
const QuestionPage: React.FC = () => {
  const router = useReactRouter<{ id: string; page: string }>();
  const meetingId = router.match.params.id;
  const page = router.match.params.page;
  const [peopleCount, setPeopleCount] = useState(0);
  const questionIds = useSelector(
    (rootState: RootState) =>
      rootState.questions.questionsByMeetingId[meetingId]
  );
  const personInfo = useSelector(
    (rootState: RootState) => rootState.auth.personInfo
  );
  const questions = useSelector((rootState: RootState) =>
    questionIds?.map((id) => rootState.questions.questions[`${id}`])
  );
  const roomInformation = useSelector(
    (rootState: RootState) =>
      rootState.roomsInformation.roomsInformation[meetingId]
  );
  const isHost = personInfo?.userId === roomInformation.owenId;
  const questionLimitStatus = useSelector(
    (rootState: RootState) =>
      rootState.roomsInformation.questionLimitStatus[meetingId]
  );
  const liveStatus = useSelector(
    (rootState: RootState) => rootState.roomsInformation.liveStatus[meetingId]
  );
  const [formState, { textarea }] = useFormState();
  const [files, setFiles] = useState<FileList | null>(null);
  const [isQuestion, setIsQuestion] = useState<boolean[]>([
    true,
    false,
    false,
    false
  ]);
  const dispatch = useDispatch();
  const questionActive = [true, false, false, false];
  const moderateActive = [false, true, false, false];
  const inAppropriateQuestionActive = [false, false, true, false];
  const inAppropriateRepliesActive = [false, false, false, true];
  useEffect(() => {
    dispatch(fetchRoomInformation(parseInt(meetingId)));
  }, [dispatch, meetingId]);
  useEffect(() => {
    dispatch(getLiveStatus(parseInt(meetingId)));
  }, [dispatch, meetingId]);
  useEffect(() => {
    dispatch(fetchQuestions(parseInt(meetingId)));
  }, [dispatch, meetingId]);
  
  useEffect(()=>{
    const newQuestionListener = (question: IQuestion) => {
      dispatch(addedQuestion(question));
    };
    const updateQuestionListener = (update: updateQuestion) => {
      dispatch(successfullyUpdateQuestion(update));
    };
    const deleteQuestionListener = (res: {
      meetingId: number;
      questionId: number;
    }) => {
      const { meetingId, questionId } = res;
      dispatch(successfullyDeleteQuestion(questionId, meetingId));
    };
    const addVoteListener = (res: { guestId: number; questionId: number }) => {
      const { guestId, questionId } = res;
      dispatch(successfullyVoteForAQuestion(questionId, guestId));
    };
    const removeVoteListener = (res: { guestId: number; questionId: number }) => {
      const { guestId, questionId } = res;
      dispatch(successfullyRemoveVote(questionId, guestId));
    };
    const answeredQuestionListener = (questionId: number) => {
      dispatch(successfullyAnsweredQuestion(questionId));
    };
    const hideOrApprovedQuestionListener = (res: {
      questionId: number;
      isHide: boolean;
    }) => {
      const { isHide, questionId } = res;
      dispatch(successfullyApprovedOrHideAQuestion(questionId, isHide));
    };
    const updateReplyListener = (res: updateReply) => {
      const { replyId, questionId, content, updatedAt } = res;
      dispatch(successfullyUpdateReply(questionId, replyId, content, updatedAt));
    };
    const createReplyListener = (res: reply) => {
      dispatch(addedReplyToQuestion(res));
    };
    const deleteReplyListener = (res: {
      questionId: number;
      replyId: number;
    }) => {
      const { questionId, replyId } = res;
      dispatch(successfullyDeleteReply(questionId, replyId));
    };
    const hideOrNotReplyListener = (res: {
      replyId: number;
      questionId: number;
      isHide: boolean;
    }) => {
      const { replyId, questionId, isHide } = res;
      dispatch(successfullyHideOrDisplayAReply(replyId, questionId, isHide));
    };
    const peopleCountListener = (count: number) => {
      setPeopleCount(count);
    };
    const leaveRoom = ()=>{
    socket.emit('leave_event', meetingId);
    socket.off('create-question', newQuestionListener);
    socket.off('update-question', updateQuestionListener);
    socket.off('delete-question', deleteQuestionListener);
    socket.off('add-vote', addVoteListener);
    socket.off('remove-vote', removeVoteListener);
    socket.off('answered-question', answeredQuestionListener);
    socket.off('hideOrApproved-question', hideOrApprovedQuestionListener);
    socket.off('update-reply', updateReplyListener);
    socket.off('create-reply', createReplyListener);
    socket.off('delete-reply', deleteReplyListener);
    socket.off('hideOrNotHide-reply', hideOrNotReplyListener);
    }
      socket.emit('join_event', meetingId);
      socket.on('create-question', newQuestionListener);
      socket.on('update-question', updateQuestionListener);
      socket.on('delete-question', deleteQuestionListener);
      socket.on('add-vote', addVoteListener);
      socket.on('remove-vote', removeVoteListener);
      socket.on('answered-question', answeredQuestionListener);
      socket.on('hideOrApproved-question', hideOrApprovedQuestionListener);
      socket.on('update-reply', updateReplyListener);
      socket.on('create-reply', createReplyListener);
      socket.on('delete-reply', deleteReplyListener);
      socket.on('hideOrNotHide-reply', hideOrNotReplyListener);
      socket.on('update-count', peopleCountListener);
      window.addEventListener('beforeunload', leaveRoom);
      return () => {
        window.removeEventListener('beforeunload', leaveRoom);
        leaveRoom();
      };

  },[dispatch, meetingId]);
  useEffect(() => {
    const leaveHost = ()=>{
      if(isHost) socket.emit('leave-host', personInfo?.userId);
    }
      if(isHost) socket.emit('join-host', personInfo?.userId);
      window.addEventListener('beforeunload', leaveHost);
      return () => {
        window.removeEventListener('beforeunload', leaveHost);
        leaveHost();
      };
    },[roomInformation]); // this

  const mostPopularQuestions = questions
    ?.filter(
      (question) =>
        !question.isAnswered && !question.isHide && question.isApproved
    )
    .sort((a, b) => b.likes.length - a.likes.length);
  const latestQuestions = mostPopularQuestions
    ?.slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  const answeredQuestions = questions?.filter(
    (question) => question.isAnswered && !question.isHide && question.isApproved
  );
  const questionsNeedToBeApproved = questions
    ?.filter((question) => !question.isApproved && !question.isHide)
    .sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    );
  const questionsInAppropriate = questions?.filter(
    (question) => question.isHide
  );
  const replyInAppropriate = questions
    ?.map((question) => question.replies)
    .reduce((a, b) => {
      return a.concat(b);
    })
    .filter((reply) => reply.isHide);
  return (
    <div className="p-1 p-sm-2 p-md-3 p-lg-4 p-xl-5 question-page">
      <div className="meeting-information d-flex justify-content-sm-between flex-wrap mb-4 align-items-center">
        <div className="d-flex">
          <span>{roomInformation?.name}</span>
          <span className="px-2">
            <i className="fas fa-users"></i> {peopleCount}
          </span>
        </div>
        {isHost === false &&
          roomInformation.canModerate && (
            <div data-testid='moderation-count'>Moderation: {questionsNeedToBeApproved?.length}</div>
          )}
        {isHost && (
          <div className="d-flex">
            <div className="util-spacing" data-testid='facebook-live'>
              <i className="fab fa-facebook-f fa-lg"></i>{' '}
              {liveStatus?.facebook ? (
                <i className="fas fa-toggle-on fa-lg"></i>
              ) : (
                <i className="fas fa-toggle-off fa-lg"></i>
              )}
            </div>
            <div
              data-testid='youtube-live'
              className="util-spacing"
              onClick={() => {
                dispatch(
                  toggleYoutubeLiveStatus(
                    parseInt(meetingId),
                    liveStatus?.youtube ? false : true
                  )
                );
              }}
            >
              <i className="fab fa-youtube-square fa-lg"></i>{' '}
              {liveStatus?.youtube ? (
                <i className="fas fa-toggle-on fa-lg"></i>
              ) : (
                <i className="fas fa-toggle-off fa-lg"></i>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="question-form text-left mb-4">
        <div className="d-flex text-area-container rounded shadow flex-wrap">
          <div className="flex-grow-1 p-2">
            {
              <textarea
                {...textarea('question')}
                placeholder="What's on your mind?"
                data-testid="textarea-new-question"
              ></textarea>
            }
          </div>
          <div className="d-flex align-items-end">
            {
              <>
                {!(
                  questionLimitStatus?.count >= roomInformation?.questionLimit
                ) && (
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
                )}
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
                      onChange={(event) => setFiles(event.currentTarget.files)}
                      multiple
                      accept="image/*"
                    />
                  </div>
                )}
              </>
            }
          </div>
        </div>
      </div>
      <div className="question-moderation bottom-border pb-3 d-flex mb-4">
        <div>
          <button
            className={`util-spacing rounded ${isQuestion[0] && 'is-active'}`}
            onClick={() => {
              setIsQuestion(questionActive);
            }}
          >
            QUESTIONS{' '}
            {mostPopularQuestions?.length > 0
              ? `(${mostPopularQuestions.length})`
              : ''}
          </button>
        </div>
        {roomInformation?.canModerate &&
          isHost && (
            <div data-testid="moderation-tab">
              <button
                className={`util-spacing rounded ${
                  isQuestion[1] && 'is-active'
                }`}
                onClick={() => {
                  setIsQuestion(moderateActive);
                }}
              >
                MODERATION{' '}
                {questionsNeedToBeApproved.length > 0
                  ? `(${questionsNeedToBeApproved.length})`
                  : ''}
              </button>
            </div>
          )}
        {isHost && (
          <div>
            <button
              className={`util-spacing rounded ${isQuestion[2] && 'is-active'}`}
              data-testid="inappropriate-questions-tab"
              onClick={() => {
                setIsQuestion(inAppropriateQuestionActive);
              }}
            >
              INAPPROPRIATE QUESTIONS{' '}
              {questionsInAppropriate?.length > 0
                ? `(${questionsInAppropriate.length})`
                : ''}
            </button>
          </div>
        )}
        {isHost && (
          <div>
            <button
              className={`util-spacing rounded ${isQuestion[3] && 'is-active'}`}
              data-testid="inappropriate-replies-tab"
              onClick={() => {
                setIsQuestion(inAppropriateRepliesActive);
              }}
            >
              INAPPROPRIATE REPLIES{' '}
              {replyInAppropriate?.length > 0
                ? `(${replyInAppropriate.length})`
                : ''}
            </button>
          </div>
        )}
      </div>
      <div className="content-container p-2">
        {isQuestion[0] && (
          <>
            <div className="text-left mb-4 d-flex">
              <button
                className={`util-spacing will-hover rounded question-page-tab ${
                  page === 'main' && 'is-active'
                }`}
                onClick={() => {
                  dispatch(push(`/room/${meetingId}/questions/main`));
                }}
              >
                Most Popular
              </button>
              <button
                className={`util-spacing will-hover rounded question-page-tab ${
                  page === 'latest' && 'is-active'
                }`}
                onClick={() => {
                  dispatch(push(`/room/${meetingId}/questions/latest`));
                }}
              >
                Latest
              </button>
              <button
                className={`util-spacing will-hover rounded question-page-tab ${
                  page === 'answered' && 'is-active'
                }`}
                onClick={() => {
                  dispatch(push(`/room/${meetingId}/questions/answered`));
                }}
              >
                Answered{' '}
                {answeredQuestions?.length > 0
                  ? `(${answeredQuestions.length})`
                  : ''}
              </button>
            </div>
            <div>
              {page === 'main' && (
                <FlipMove>
                  {mostPopularQuestions?.map((question) => {
                    return (
                      <Question
                        key={question.id}
                        user={personInfo}
                        canUploadFiles={roomInformation.canUploadFiles}
                        question={question}
                        answering={
                          mostPopularQuestions[0].id === question.id
                            ? true
                            : false
                        }
                        isModerate={false}
                        isHost={isHost}
                      />
                    );
                  })}
                </FlipMove>
              )}

              {page === 'latest' &&
                latestQuestions?.map((question) => {
                  return (
                    <Question
                      key={question.id}
                      user={personInfo}
                      canUploadFiles={roomInformation.canUploadFiles}
                      question={question}
                      answering={
                        mostPopularQuestions[0].id === question.id
                          ? true
                          : false
                      }
                      isModerate={false}
                      isHost={isHost}
                    />
                  );
                })}
              {page === 'answered' &&
                answeredQuestions?.map((question, i) => {
                  return (
                    !question.isHide &&
                    question.isAnswered && (
                      <Question
                        key={question.id}
                        user={personInfo}
                        canUploadFiles={roomInformation.canUploadFiles}
                        question={question}
                        answering={false}
                        isModerate={false}
                        isHost={isHost}
                      />
                    )
                  );
                })}
            </div>
          </>
        )}
        {roomInformation?.canModerate &&
          isQuestion[1] &&
          (questionsNeedToBeApproved.length > 0 ? (
            questionsNeedToBeApproved.map((question) => {
              return (
                <div
                  className="moderate-container"
                  data-testid="moderate-questions"
                >
                  <Question
                    key={`${question.id}`}
                    user={personInfo}
                    canUploadFiles={roomInformation.canUploadFiles}
                    question={question}
                    answering={false}
                    isModerate={true}
                    isHost={isHost}
                  />
                </div>
              );
            })
          ) : (
            <div
              className="moderate-container"
              data-testid="no-moderate-questions"
            >
              No questions need to be approved
            </div>
          ))}
        {isQuestion[2] &&
          (questionsInAppropriate.length > 0 ? (
            questionsInAppropriate.map((question) => {
              return (
                <div
                  className="moderate-container"
                  data-testid="moderate-questions"
                  key={question.id}
                >
                  <Question
                    //key={`${question.id}`}
                    user={personInfo}
                    canUploadFiles={roomInformation.canUploadFiles}
                    question={question}
                    answering={false}
                    isModerate={false}
                    isHost={isHost}
                  />
                </div>
              );
            })
          ) : (
            <div
              className="moderate-container"
              data-testid="no-moderate-questions"
            >
              No Inappropriate questions
            </div>
          ))}
        {isQuestion[3] &&
          (replyInAppropriate.length > 0 ? (
            replyInAppropriate.map((reply) => {
              return (
                <div
                  className="moderate-container"
                  data-testid="moderate-questions"
                >
                  <Reply
                    reply={reply}
                    user={personInfo}
                    meetingId={parseInt(meetingId)}
                    isHost={isHost}
                  />
                </div>
              );
            })
          ) : (
            <div
              className="moderate-container"
              data-testid="no-moderate-questions"
            >
              No Inappropriate replies
            </div>
          ))}
      </div>
    </div>
  );
};

export default QuestionPage;
