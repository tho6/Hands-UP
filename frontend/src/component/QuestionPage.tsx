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
  getLiveStatus,
  toggleFacebookLiveStatus,
  turnOnFacebookAgain
} from '../redux/rooms/thunk';
import { fetchQuestions, addQuestion } from '../redux/questions/thunk';
import { push } from 'connected-react-router';
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
import {
  successfullyToggleYoutubeLiveStatus,
  successfullyToggleFacebookLiveStatus,
  successfullyUpdatedRoomConfiguration,
  googlePermissionModal,
  message
} from '../redux/rooms/actions';
import FacebookModal from './FacebookModal';
import RoomSettingButton from './RoomSetting';
import { IRoomConfiguration } from '../models/IRoomInformation';
import ScrollTop from './ScrollTop';
import TextareaAutosize from 'react-textarea-autosize';
import YesNoModal from './YesNoModal';
import { Button, Link } from 'react-scroll';
const QuestionPage: React.FC = () => {
  const router = useReactRouter<{
    id: string;
    page: string;
    error?: string;
    fbcontinue?: string;
  }>();
  const meetingId = router.match.params.id;
  const page = router.match.params.page;
  const error = router.match.params.error;
  const fbcontinue = router.match.params.fbcontinue;
  const [peopleCount, setPeopleCount] = useState(0);
  const [youtubeViews, setYoutubeViews] = useState(0);
  const [facebookViews, setFacebookViews] = useState(0);
  const [facebookModal, setFacebookModal] = useState(false);
  const [isAnswering, setIsAnswering] = useState(0);
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
  const isHost = personInfo?.userId === roomInformation?.ownerId;
  const questionLimitStatus = useSelector(
    (rootState: RootState) =>
      rootState.roomsInformation.questionLimitStatus[meetingId]
  );
  const liveStatus = useSelector(
    (rootState: RootState) => rootState.roomsInformation.liveStatus[meetingId]
  );
  const showGooglePermissionModal = useSelector(
    (rootState: RootState) =>
      rootState.roomsInformation.googlePermissionConfirmModal
  );
  const [textState, setTextState] = useState('');
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
    if (!isHost) return;
    dispatch(getLiveStatus(parseInt(meetingId)));
  }, [dispatch, meetingId]);
  useEffect(() => {
    dispatch(fetchQuestions(parseInt(meetingId)));
  }, [dispatch, meetingId]);
  /* Join and leave room (guest) */
  useEffect(() => {
    if (!personInfo?.guestId) return;
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
    const removeVoteListener = (res: {
      guestId: number;
      questionId: number;
    }) => {
      const { guestId, questionId } = res;
      dispatch(successfullyRemoveVote(questionId, guestId));
    };
    const answeredQuestionListener = (message: { questionId: number }) => {
      dispatch(successfullyAnsweredQuestion(message.questionId));
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
      dispatch(
        successfullyUpdateReply(questionId, replyId, content, updatedAt)
      );
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
    const updateRoomConfiguration = (res: {
      roomConfiguration: IRoomConfiguration;
      meetingId: number;
    }) => {
      const { meetingId, roomConfiguration } = res;
      dispatch(
        successfullyUpdatedRoomConfiguration(meetingId, roomConfiguration)
      );
    };
    const answering = (id: number) => {
      setIsAnswering(id);
    };
    const leaveRoom = () => {
      socket.emit('leave_event', meetingId, personInfo.guestId);
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
      socket.off('update-room-configuration', updateRoomConfiguration);
      socket.off('answering', answering);
    };
    socket.emit('join_event', meetingId, personInfo.guestId);
    socket.on('answering', answering);
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
    socket.on('update-room-configuration', updateRoomConfiguration);
    window.addEventListener('beforeunload', leaveRoom);
    return () => {
      window.removeEventListener('beforeunload', leaveRoom);
      leaveRoom();
    };
  }, [dispatch, meetingId, personInfo]);
  useEffect(() => {
    if (!roomInformation?.ownerId) return;
    if (isHost) return;
    socket.emit('new-user-join', roomInformation.ownerId);
  }, [roomInformation]);
  useEffect(() => {
    if (!isHost) return;
    const turnOffYoutubeLive = () => {
      dispatch(successfullyToggleYoutubeLiveStatus(parseInt(meetingId), false));
    };
    const turnOffFacebookLive = () => {
      dispatch(
        successfullyToggleFacebookLiveStatus(parseInt(meetingId), false)
      );
    };
    const youtubeViewsStop = (msg: string) => {
      dispatch(message(true, msg));
    };
    const youtubeViewsUpdate = (views: string | number) => {
      setYoutubeViews(parseInt(`${views}`));
    };
    const facebookViewsStop = (msg: string) => {
      window.alert(msg);
    };
    const facebookViewsUpdate = (views: string | number) => {
      setFacebookViews(parseInt(`${views}`));
    };
    const newUserJoin = () => {
      socket.emit('answering', parseInt(meetingId), isAnswering);
    };
    const leaveHost = () => {
      if (!isHost) return;
      socket.emit('leave-host', personInfo?.userId);
      socket.off('youtube-stop', turnOffYoutubeLive);
      socket.off('facebook-stop', turnOffFacebookLive);
      socket.off('youtube-views-stop', youtubeViewsStop);
      socket.off('youtube-views-update', youtubeViewsUpdate);
      socket.off('facebook-views-stop', facebookViewsStop);
      socket.off('facebook-views-update', facebookViewsUpdate);
      socket.off('new-user-join', newUserJoin);
    };
    socket.emit('join-host', personInfo?.userId);
    socket.on('youtube-stop', turnOffYoutubeLive);
    socket.on('facebook-stop', turnOffFacebookLive);
    socket.on('youtube-views-stop', youtubeViewsStop);
    socket.on('youtube-views-update', youtubeViewsUpdate);
    socket.on('facebook-views-stop', facebookViewsStop);
    socket.on('facebook-views-update', facebookViewsUpdate);
    socket.on('new-user-join', newUserJoin);
    window.addEventListener('beforeunload', leaveHost);
    return () => {
      leaveHost();
      window.removeEventListener('beforeunload', leaveHost);
    };
  }, [personInfo, isHost, meetingId, dispatch]); // this
  useEffect(() => {
    if (!isHost) return;
    const newUserJoin = () => {
      socket.emit('answering', parseInt(meetingId), isAnswering);
    };
    const leaveHost = () => {
      if (!isHost) return;
      socket.off('new-user-join', newUserJoin);
    };
    socket.on('new-user-join', newUserJoin);
    window.addEventListener('beforeunload', leaveHost);
    return () => {
      leaveHost();
      window.removeEventListener('beforeunload', leaveHost);
    };
  }, [isHost, meetingId, isAnswering]); // this

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
  let replyInAppropriate: reply[] = [];
  if (questions?.length > 0)
    replyInAppropriate = questions
      ?.map((question) => question.replies)
      .reduce((a, b) => {
        return a.concat(b);
      })
      .filter((reply) => reply.isHide);
  const sendEvent = () => {
    if (!textState.trim()) {
      window.alert('Empty question is not allowed!');
      return;
    }
    if (files?.length !== undefined && files.length > 3) {
      window.alert('Maximum of three images for each question!');
      setFiles(null);
      return;
    }
    dispatch(addQuestion(parseInt(meetingId), textState, files));
    setTextState('');
    setFiles(null);
  };
  useEffect(() => {
    if (error === 'youtube-error') {
      dispatch(message(true, 'You may try to reset platform'));
      // dispatch(push(`/room/${meetingId}/questions/main`));
    } else if (error === 'facebook-error') {
      dispatch(message(true, 'We need your permission'));
    } else if (error === 'facebook-modal') {
      setFacebookModal(true);
    } else if (error === 'continue') {
      const arr = fbcontinue?.split('+')!;
      if (arr[0] === 'user')
        dispatch(toggleFacebookLiveStatus(parseInt(meetingId), true, arr[0]));
      if (arr[0] === 'page')
        dispatch(
          toggleFacebookLiveStatus(parseInt(meetingId), true, arr[0], arr[1])
        );
    }
  }, [error, dispatch, fbcontinue, meetingId]);
  return (
    <div className="p-1 p-sm-2 p-md-3 p-lg-4 p-xl-5 question-page mt-5">
      <div className="meeting-information d-flex justify-content-sm-between flex-wrap mb-4 align-items-center mt-5 mt-sm-4 mt-mid-3 mt-lg-2 mt-xl-1">
        <div className="d-flex">
          <span className="position-relative">
            {isHost && (
              <RoomSettingButton
                meetingId={parseInt(meetingId)}
                roomConfig={{
                  canModerate: roomInformation?.canModerate,
                  canUploadFile: roomInformation?.canUploadFile,
                  questionLimit: roomInformation?.questionLimit
                }}
              />
            )}
          </span>
          <span>{roomInformation?.name}</span>
          <span className="px-2">
            <i className="fas fa-users"></i> {peopleCount}
          </span>
          {isHost && liveStatus?.facebook && (
            <span className="px-2">
              <i className="fab fa-facebook-f"></i> {facebookViews}
            </span>
          )}
          {isHost && liveStatus?.youtube && (
            <span className="px-2">
              <i className="fab fa-youtube"></i> {youtubeViews}
            </span>
          )}
        </div>
        {isHost === false && roomInformation?.canModerate && (
          <div data-testid="moderation-count">
            Moderation: {questionsNeedToBeApproved?.length}
          </div>
        )}
        {isHost && (
          <div className="d-flex">
            <div
              className="util-spacing will-hover"
              data-testid="facebook-live"
              onClick={() => {
                if (liveStatus?.facebook === true) {
                  dispatch(
                    toggleFacebookLiveStatus(parseInt(meetingId), false, 'page')
                  );
                  return;
                }
                if (liveStatus?.facebook === false) {
                  dispatch(turnOnFacebookAgain(parseInt(meetingId)));
                  return;
                }
                setFacebookModal(true);
                // const loginLocationWithPrompt = `https://www.facebook.com/v7.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&display=page&redirect_uri=${process.env.REACT_APP_FACEBOOK_REDIRECT_URL}&state=${meetingId}+facebook-modal&scope=user_videos,pages_read_engagement,pages_read_user_content,pages_show_list`
                // window.location.replace(loginLocationWithPrompt);
              }}
            >
              <i className="fab fa-facebook-f fa-lg"></i>{' '}
              {liveStatus?.facebook ? (
                <i className="fas fa-toggle-on fa-lg"></i>
              ) : (
                <i className="fas fa-toggle-off fa-lg"></i>
              )}
            </div>
            <div
              data-testid="youtube-live"
              className="util-spacing will-hover"
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
              <TextareaAutosize
                placeholder="What's on your mind?"
                value={textState}
                onKeyDown={(e) => {
                  if (e.keyCode === 13 && !e.shiftKey) {
                    e.preventDefault();
                    sendEvent();
                  }
                }}
                onChange={(e) => {
                  setTextState(e.target.value);
                }}
              />
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
                      sendEvent();
                    }}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </div>
                )}
                {roomInformation?.canUploadFile && (
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
        <div className="d-flex">
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
          {roomInformation?.canModerate && isHost && (
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
                {questionsNeedToBeApproved?.length > 0
                  ? `(${questionsNeedToBeApproved.length})`
                  : ''}
              </button>
            </div>
          )}
        </div>
        <div className="d-flex">
          {isHost && roomInformation?.canModerate && (
            <div>
              <button
                className={`util-spacing rounded ${
                  isQuestion[2] && 'is-active'
                }`}
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
          {isHost && roomInformation?.canModerate && (
            <div>
              <button
                className={`util-spacing rounded ${
                  isQuestion[3] && 'is-active'
                }`}
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
              {isAnswering !== 0 && (
                <div className='mic-container'>
                <Link
                  className="util-spacing will-hover question-page-tab mic"
                  to="answering"
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-55}
                  type={'button'}
                >
                  <i className="fas fa-microphone" data-testid="answering"></i>
                </Link>
                </div>
              )}
            </div>
            <div>
              {page === 'main' && (
                <FlipMove>
                  {mostPopularQuestions?.map((question) => {
                    return (
                      <Question
                        key={question.id}
                        user={personInfo}
                        isAnswering={isAnswering === question.id}
                        canUploadFile={roomInformation?.canUploadFile}
                        question={question}
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
                      isAnswering={isAnswering === question.id}
                      canUploadFile={roomInformation?.canUploadFile}
                      question={question}
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
                        isAnswering={false}
                        canUploadFile={roomInformation?.canUploadFile}
                        question={question}
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
          (questionsNeedToBeApproved?.length > 0 ? (
            questionsNeedToBeApproved.map((question) => {
              return (
                <div
                  className="moderate-container"
                  data-testid="moderate-questions"
                >
                  <Question
                    key={`${question.id}`}
                    user={personInfo}
                    isAnswering={false}
                    canUploadFile={roomInformation?.canUploadFile}
                    question={question}
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
                    isAnswering={false}
                    canUploadFile={roomInformation?.canUploadFile}
                    question={question}
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
      {facebookModal && (
        <FacebookModal
          title={'Where do you want to start your live broadcast?'}
          message={'Choose your platform'}
          yes={(liveLoc: string, pageId: string = '') => {
            dispatch(
              toggleFacebookLiveStatus(
                parseInt(meetingId),
                true,
                liveLoc,
                liveLoc === 'page' ? pageId : ''
              )
            );
            setFacebookModal(false);
          }}
          no={() => {
            setFacebookModal(false);
          }}
        />
      )}
      {showGooglePermissionModal && (
        <YesNoModal
          title={'Redirect to Google'}
          message={'Confirm to redirect to permission page'}
          yes={() => {
            const loginLocationWithPrompt = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_YOUTUBE_REDIRECT_URL}&scope=https://www.googleapis.com/auth/youtube.readonly&state=${meetingId}&response_type=code&access_type=offline`;
            window.location.replace(loginLocationWithPrompt);
          }}
          no={() => {
            dispatch(googlePermissionModal(false));
          }}
        />
      )}
      <ScrollTop />
    </div>
  );
};

export default QuestionPage;
