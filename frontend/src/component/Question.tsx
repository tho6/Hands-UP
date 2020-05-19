import React, { useState } from 'react';
import { IQuestion } from '../models/IQuestion';
import './question.scss';
import YesNoModal from './YesNoModal';
import { useDispatch } from 'react-redux';
import {
  deleteQuestion,
  editQuestionPlainText,
  addReplyToQuestion,
} from '../redux/questions/thunk';
import { useFormState } from 'react-use-form-state';
import { IUserQ, IGuest } from '../models/IUserQ';
import Collapse from 'react-bootstrap/Collapse';
import { Reply } from './Reply';

interface IQuestionProps {
  question: IQuestion;
  user: (IUserQ & IGuest) | null;
  canUploadFiles: boolean;
  answering: boolean;
}

const Question: React.FC<IQuestionProps> = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [formState, { textarea }] = useFormState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplyTextArea, setShowReplyTextArea] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelReplyModal, setShowCancelReplyModal] = useState(false);
  const { user, question, canUploadFiles, answering } = props;
  const canEdit = user?.guestId === question.questioner.id;
  const dispatch = useDispatch();
  return (
    <div className="mb-4 d-flex">
      <div className="question flex-grow-1 p-2 p-lg-4">
        <div className="d-flex question-content-area">
          <div className="content text-wrap mb-2">
            {isEdit ? (
              <textarea
                className="mb-2 rounded"
                {...textarea('content')}
              ></textarea>
            ) : (
              props.question.content
            )}
          </div>
          {answering === true && <span className="mb-2">Answering</span>}
        </div>
        <div className="image-area mb-2 text-left d-flex flex-wrap">
          <div className="p-2 mr-4">
            <img className="mw-100" src="/456.png" alt="testing" />
            {isEdit && (
              <span className="p-2">
                <i className="fas fa-times"></i>
              </span>
            )}
          </div>
          <div className="p-2 mr-4">
            <img className="mw-100" src="/456.png" alt="testing" />
            {isEdit && (
              <span className="p-2">
                <i className="fas fa-times"></i>
              </span>
            )}
          </div>
          <div className="p-2 mr-4">
            <img className="mw-100" src="/123.png" alt="testing" />
            {isEdit && (
              <span className="p-2">
                <i className="fas fa-times"></i>
              </span>
            )}
          </div>
          <div className="p-2 mr-4">
            <img className="mw-100" src="/456.png" alt="testing" />
            {isEdit && (
              <span className="p-2">
                <i className="fas fa-times"></i>
              </span>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-between util-container mb-2">
          <div className="d-flex p-2">
            <div className="p-2 mx-sm-4 mx-lg-5">
              <i className="far fa-thumbs-up"></i> {question.likes}
            </div>
            <div className="p-2 ml-sm-4 ml-lg-5">
              <i className="far fa-comment"></i> [
              {question.replies.length}]
            </div>
          </div>
          <div className="d-flex p-2">
            <div className="to-center util-spacing">{question.questioner.name}</div>
            {isEdit && (
              <>
                <div
                  className="util-spacing"
                  onClick={() => {
                    if (!formState.values.content.trim()) {
                      window.alert('Question cannot be empty!');
                      return;
                    }
                    dispatch(
                      editQuestionPlainText(
                        question.id,
                        formState.values.content,
                      ),
                    );
                    setIsEdit(false);
                  }}
                >
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <div
                  className="util-spacing"
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="fas fa-trash-alt"></i>
                </div>
                <div
                  className="util-spacing"
                  onClick={() => setShowCancelModal(true)}
                >
                  <i className="fas fa-ban"></i>
                </div>
              </>
            )}
            {!isEdit && canEdit && (
              <div
                className="util-spacing"
                onClick={() => {
                  formState.setField('content', question.content);
                  setIsEdit(true);
                }}
              >
                <i className="fas fa-pencil-alt"></i>
              </div>
            )}

            <div
              className="p-2 ml-sm-3"
              onClick={() => {
                showReplyTextArea
                  ? setShowReplyTextArea(false)
                  : setShowReplyTextArea(true);
              }}
            >
              <i className="fas fa-reply"></i>
            </div>
          </div>
        </div>
        <Collapse in={showReplyTextArea}>
          <div className={`new-reply-area ${showReplyTextArea && 'show'}`}>
            <div className="text-left">Replying to this question</div>
            <div className="d-flex reply-body mb-4">
              <textarea
                className="mr-2 rounded"
                {...textarea('reply')}
                placeholder="Your reply to this question."
              ></textarea>
              <div className="align-self-end">
                <span
                  className="mx-2 p-2"
                  onClick={() => {
                    if (!formState.values.reply.trim()) {
                      window.alert('Reply cannot be empty!');
                      return;
                    }
                    dispatch(addReplyToQuestion(question.id, user?.guestId!,formState.values.reply));
                    formState.setField('reply', '');
                    setShowReplyTextArea(false);
                  }}
                >
                  <i className="fas fa-paper-plane"></i>
                </span>
                <span
                  className="p-2"
                  onClick={() => {
                    setShowCancelReplyModal(true);
                  }}
                >
                  <i className="fas fa-ban"></i>
                </span>
              </div>
            </div>
          </div>
        </Collapse>
        <div className = 'px-5 mb-2'>
        {question.replies.map((reply) => {
          return <Reply key={reply.id} reply={reply} user={user} meetingId={question.meetingId}></Reply>;
        })}
        </div>
      </div>
      <div className="p-2 platform-icon">
        <i className="fab fa-facebook fa-2x"></i>
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
          message="Are you sure to discard your changes?"
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
          message="Are you sure to discard your message? "
          yes={() => {
            setShowCancelReplyModal(false);
            setShowReplyTextArea(false);
            formState.setField('reply', '');
          }}
          no={() => {
            setShowCancelReplyModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Question;
