import React, { useState, forwardRef } from 'react';
import { IQuestion } from '../models/IQuestion';
import './question.scss';
import YesNoModal from './YesNoModal';
import { useDispatch } from 'react-redux';
import youtube_logo from '../reportIcon/youtube_icon.svg'
import facebook_logo from '../reportIcon/facebook_icon.svg'
import handsup_logo from '../reportIcon/handsup_icon.png'
import {
  deleteQuestion,
  addReplyToQuestion,
  removeVote,
  addVote,
  editQuestion,
  approveOrHideQuestion,
  answeredQuestion
} from '../redux/questions/thunk';
import { useFormState } from 'react-use-form-state';
import Collapse from 'react-bootstrap/Collapse';
import Reply from './Reply';
import { PersonInfo } from '../redux/auth/reducers';
import ImageContainer from './ImageContainer';
import TextareaAutosize from 'react-textarea-autosize';

export interface IQuestionProps {
  question: IQuestion;
  user: PersonInfo|null;
  canUploadFile: boolean;
  answering: boolean;
  isModerate: boolean;
  isHost:boolean
}

const Question: React.FC<IQuestionProps> = forwardRef((props, ref: any) => {
  const [isEdit, setIsEdit] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [formState, { textarea }] = useFormState();
  const [textState, setTextState] = useState('');
  const [replyTextState, setReplyTextState] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplyTextArea, setShowReplyTextArea] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelReplyModal, setShowCancelReplyModal] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [deleteFiles, setDeleteFiles] = useState<number[]>([]);
  const { user, question, canUploadFile, answering, isModerate, isHost } = props;
  const canEdit = (user?.guestId === question.questioner.id) || isHost;
  const isLike = question.likes.findIndex((id) => id === user?.guestId) !== -1;
  const dispatch = useDispatch();
  const questionContentBackUp = question.content;
  const sendReply = ()=>{
    if (!replyTextState.trim()) {
      window.alert('Empty reply is not allowed!');
      return;
    }
    dispatch(
      addReplyToQuestion(question.id, replyTextState)
    );
    setReplyTextState('');
    setShowReplyTextArea(false);
  }
  const sendEditedQuestion = ()=>{
    if (!textState.trim()) {
      window.alert('Empty question is no allowed!');
      return;
    }

    if (files !== null) {
      const totalImages =
        files.length +
        question.files.length -
        deleteFiles.length;
      if (totalImages > 3) {
        window.alert(
          'Maximum of 3 images are allowed in each question'
        );
        return;
      }
    }
    if (
      questionContentBackUp === textState &&
      files === null &&
      deleteFiles.length === 0
    ) {
      setIsEdit(false);
      return;
    }
    dispatch(
      editQuestion(
        question.id,
        textState,
        deleteFiles,
        files
      )
    );
    setIsEdit(false);
  }
  return (
    <div ref={ref}>
      <div className="mb-4 d-flex question-container">
        <div className="question flex-grow-1 p-3 p-lg-4">
          <div className="d-flex question-content-area">
            <div className="content text-wrap mb-2">
              {isEdit ? (
                  <TextareaAutosize
                  placeholder="Editing your question..."
                  value={textState}
                  onKeyDown={(e)=>{
                    if(e.keyCode === 13 && !e.shiftKey){
                      e.preventDefault();
                      sendEditedQuestion();
                    }
                  }}
                  onChange={(e) => {
                    setTextState(e.target.value);
                  }}
                />
                // <textarea
                //   className="mb-2 rounded"
                //   {...textarea('content')}
                // ></textarea>
              ) : (
                question.content
              )}
            {!isEdit &&
              new Date(question.updatedAt).getTime() !==
                new Date(question.createdAt).getTime() && <span>[Edited]</span>}
            </div>
            <div className="d-flex justify-content-end">
              {answering === true && (
                <span className="util-spacing">
                  <i className="fas fa-microphone" data-testid="answering"></i>
                </span>
              )}
            </div>
          </div>
          <div className="image-area mb-2 text-left d-flex flex-wrap">
            {question.files
              .filter((file) =>
                isEdit ? !deleteFiles.includes(file.id) : file
              )
              .map((file) => {
                return (
                  <div key={file.id} className="p-2 mr-4">
                    <img
                      className="mw-100 image-no-zoom"
                      src={`${file.filename}`}
                      alt={file.filename}
                      data-testid="image"
                      onClick={()=>setShowImage(true)}
                    />
                    {showImage && <ImageContainer fileName={file.filename} no={()=>setShowImage(false)}/>}
                    {isEdit && (
                      <span
                        className="p-2"
                        onClick={() => {
                          const updateDeleteFiles = [...deleteFiles];
                          updateDeleteFiles.push(file.id);
                          setDeleteFiles(updateDeleteFiles);
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
          <div className="d-flex justify-content-between util-container mb-2 mw-100">
            <div className="d-flex p-2 flex-grow-1 justify-content-between">
              <div className='d-flex'>
              <div
                className="p-2 mx-sm-4 mx-lg-5 will-hover"
                onClick={() => {
                  user?.guestId &&
                    (isLike
                      ? dispatch(removeVote(question.id))
                      : dispatch(addVote(question.id)));
                }}
              >
                {isLike ? (
                  <i className="fas fa-thumbs-up"></i>
                ) : (
                  <i className="far fa-thumbs-up"></i>
                )}{' '}
                {question.likes.length}
              </div>
              <div
                className="p-2 ml-sm-4 ml-lg-5 will-hover"
                onClick={() =>
                  showReplies ? setShowReplies(false) : setShowReplies(true)
                }
              >
                <i className="far fa-comment"></i> [
                {question.replies.filter((reply) => !reply.isHide).length}]
              </div>
              </div>
              <div className="to-center util-spacing text-word-break">
                {question.questioner.id === user?.guestId?'You':question.questioner.name}
              </div>
            </div>
            <div className="d-flex p-2 flex-wrap justify-content-end">
              
              {isEdit && (
                <div className="d-flex">
                  <div
                    className="util-spacing will-hover"
                    onClick={() => {
                      sendEditedQuestion();
                    }}
                  >
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <div
                    className="util-spacing will-hover"
                    onClick={() => {
                      setShowDeleteModal(true);
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </div>
                  <div>
                    {canUploadFile && (
                      <div className="util-spacing will-hover">
                        <label htmlFor="img">
                          <i className="fas fa-camera" data-testid="camera"></i>{' '}
                          (max:
                          {3 - question.files.length + deleteFiles.length}
                          ):
                        </label>
                        {files == null
                          ? 'No files'
                          : `${files.length} ${
                              files.length > 1 ? 'files' : 'file'
                            }`}
                        <input
                          className="d-none"
                          id="img"
                          type="file"
                          onChange={(event) =>
                            setFiles(event.currentTarget.files)
                          }
                          multiple
                          accept="image/*"
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className="util-spacing will-hover"
                    onClick={() =>
                      questionContentBackUp === textState &&
                      files === null &&
                      deleteFiles.length === 0
                        ? setIsEdit(false)
                        : setShowCancelModal(true)
                    }
                  >
                    <i className="fas fa-ban"></i>
                  </div>
                </div>
              )}
              {!isEdit && canEdit && (
                <div
                  className="util-spacing will-hover"
                  onClick={() => {
                    setTextState(question.content);
                    setFiles(null);
                    setIsEdit(true);
                    setDeleteFiles([]);
                  }}
                >
                  <i
                    className="fas fa-pencil-alt"
                    data-testid="edit-button"
                  ></i>
                </div>
              )}

             {!question.isAnswered && <div
                className="p-2 ml-sm-3 will-hover"
                onClick={() => {
                  showReplyTextArea
                    ? setShowReplyTextArea(false)
                    : setShowReplyTextArea(true);
                }}
              >
                <i className="fas fa-reply"></i>
              </div>}
            </div>
          </div>
          <Collapse in={showReplyTextArea}>
            <div className={`new-reply-area ${showReplyTextArea && 'show'}`}>
              <div className="text-left">Replying to this question</div>
              <div className="d-flex reply-body mb-4">
              <TextareaAutosize
                placeholder="Your reply to this question."
                value={replyTextState}
                onKeyDown={(e)=>{
                  if(e.keyCode === 13 && !e.shiftKey){
                    e.preventDefault();
                    sendReply();
                  }
                }}
                onChange={(e) => {
                  setReplyTextState(e.target.value);
                }}
              />
                {/* <textarea
                  className="mr-2 rounded"
                  {...textarea('reply')}
                  placeholder="Your reply to this question."
                ></textarea> */}
                <div className="align-self-end">
                  <span
                    className="mx-2 p-2 will-hover"
                    onClick={() => {
                      sendReply();
                    }}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </span>
                  <span
                    className="p-2 will-hover"
                    onClick={() => {
                      if (replyTextState.trim()) {
                        setShowCancelReplyModal(true);
                      } else {
                        setShowReplyTextArea(false);
                        setReplyTextState('');
                      }
                    }}
                  >
                    <i className="fas fa-ban"></i>
                  </span>
                </div>
              </div>
            </div>
          </Collapse>
          <Collapse in={showReplies}>
            <div className="px-sm-3 px-md-5 mb-2">
              {question.replies
                .filter((reply) => reply.isHide === false)
                .map((reply) => {
                  return (
                    <Reply
                      key={reply.id}
                      reply={reply}
                      user={user}
                      meetingId={question.meetingId}
                      isHost={isHost}
                    ></Reply>
                  );
                })}
            </div>
          </Collapse>
        </div>
        <div className="d-flex flex-column justify-content-between">
          {question.platform.name === 'facebook' && (
            // <div className="util-spacing platform-icon">
            <div className="question-platform-icon util-spacing">
              <img src={facebook_logo} alt="Logo" />
            </div>
          )}
          {question.platform.name === 'youtube' && (
            // <div className="util-spacing platform-icon">
            <div className="question-platform-icon util-spacing"> 
                <img src={youtube_logo} alt="Logo" />
            </div>
          )}
          {question.platform.name === 'handsup' && (
            // <div className="util-spacing platform-icon">
            <div className="question-platform-icon util-spacing">
              <img src={handsup_logo} alt="Logo" />
            </div>
          )}
          <div>
            {isHost && isModerate && (
              <div
                data-testid="approve-button"
                className="util-spacing will-hover"
                onClick={() => {
                  dispatch(approveOrHideQuestion(question.id, false));
                }}
              >
                <i className="far fa-check-circle fa-lg"></i>
              </div>
            )}
            {isHost &&
              question.isApproved &&
              !question.isAnswered &&
              !question.isHide && (
                <div
                  data-testid="answer-button"
                  className="util-spacing will-hover"
                  onClick={() => {
                    dispatch(answeredQuestion(question.id));
                  }}
                >
                  <i className="fab fa-angellist fa-lg"></i>
                </div>
              )}
            {isHost && !question.isHide && (
              <div
                data-testid="hide-button"
                className="util-spacing will-hover"
                onClick={() => {
                  dispatch(approveOrHideQuestion(question.id, true));
                }}
              >
                <i className="far fa-eye-slash fa-lg"></i>
              </div>
            )}
            {isHost && question.isHide && (
              <div
                data-testid="display-button"
                className="util-spacing will-hover"
                onClick={() => {
                  dispatch(approveOrHideQuestion(question.id, false));
                }}
              >
                <i className="far fa-eye fa-lg"></i>
              </div>
            )}
          </div>
        </div>
        {showDeleteModal && (
          <YesNoModal
            title="Delete Warnings!"
            message="Are you sure you want to delete this question?"
            yes={() => {
              dispatch(deleteQuestion(question.id, question.meetingId));
              setShowDeleteModal(false);
            }}
            no={() => {
              setShowDeleteModal(false);
            }}
          />
        )}
        {showCancelModal && (
          <YesNoModal
            title="Discard Changes"
            message="Are you sure you want to discard the changes?"
            yes={() => {
              setShowCancelModal(false);
              setIsEdit(false);
            }}
            no={() => {
              setShowCancelModal(false);
            }}
          />
        )}
        {showCancelReplyModal && (
          <YesNoModal
            title="Warning!"
            message="Are you sure you want to discard your question? "
            yes={() => {
              setShowCancelReplyModal(false);
              setShowReplyTextArea(false);
              setReplyTextState('');
            }}
            no={() => {
              setShowCancelReplyModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
});

export default Question;
