import React, { useState } from 'react';
import { reply } from '../models/IQuestion';
import YesNoModal from './YesNoModal';
import { useDispatch } from 'react-redux';
import {
  editReply,
  deleteReply,
  hideOrDisplayReply
} from '../redux/questions/thunk';
import { PersonInfo } from '../redux/auth/reducers';
import TextareaAutosize from 'react-textarea-autosize';
export interface IReplyProps {
  reply: reply;
  user: PersonInfo|null;
  meetingId: number;
  isHost: boolean
}

const Reply: React.FC<IReplyProps> = (props) => {
  const { reply, user, meetingId, isHost } = props;
  const [textState, setTextState] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setCancelModal] = useState(false);
  const canEdit = (reply.guestId === user?.guestId) || isHost;
  const dispatch = useDispatch();
  const backupValue = reply.content;
  const sendEvent =()=>{
    if (
      backupValue !== textState &&
      textState.trim()
    ) {
      dispatch(
        editReply(user?.guestId!, reply.id, textState)
      );
      setIsEdit(false);
    } else if (!textState.trim()) {
      window.alert('Empty reply is not allowed!');
    } else {
      setIsEdit(false);
    }
  }
  return (
    <div className="reply mb-3">
      <div className="content pb-2 pt-2">
        {isEdit ? (
            <TextareaAutosize
            placeholder="What's on your mind?"
            data-testid="text-area"
            value={textState}
            onKeyDown={(e)=>{
              if(e.keyCode === 13 && !e.shiftKey){
                e.preventDefault();
                sendEvent();
              }
            }}
            onChange={(e) => {
              setTextState(e.target.value);
            }}
          />
          // <textarea
          //   data-testid="text-area"
          //   className="mb-2 rounded"
          //   {...textarea('edit')}
          // ></textarea>
        ) : (
          <div>
          {reply.content} {(!isEdit) && (new Date(reply.createdAt).getTime() !== new Date(reply.updatedAt).getTime()) && (
            <span data-testid="edited-sign">[Edited]</span>
          )}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-sm-end justify-content-start edit-reply-container">
        <div className="to-center util-spacing text-word-break reply-name">{reply.guestName}</div>
        {canEdit && !isEdit && (
          <div
            className="util-spacing will-hover"
            onClick={() => {
              setTextState(reply.content);
              setIsEdit(true);
            }}
          >
            <i className="fas fa-pencil-alt" data-testid="edit-button"></i>
          </div>
        )}
        {canEdit && isEdit && (
          <div className="to-center">
            <span
              className="util-spacing will-hover"
              onClick={() => {
                sendEvent();
              }}
            >
              <i
                className="fas fa-cloud-upload-alt"
                data-testid="save-button"
              ></i>
            </span>
            <span
              className="util-spacing will-hover"
              onClick={() => {
                setShowDeleteModal(true);
              }}
            >
              <i className="fas fa-trash-alt" data-testid="delete-button"></i>
            </span>
            <span
              className="util-spacing will-hover"
              onClick={() => {
                textState === reply.content
                  ? setIsEdit(false)
                  : setCancelModal(true);
              }}
            >
              <i className="fas fa-ban" data-testid="cancel-button"></i>
            </span>
          </div>
        )}
        {isHost && !reply.isHide && (
          <div
            data-testid="hide-button"
            className="util-spacing will-hover"
            onClick={() => {
              dispatch(hideOrDisplayReply(reply.id, true));
            }}
          >
            <i className="far fa-eye-slash"></i>
          </div>
        )}
        {isHost && reply.isHide && (
          <div
            data-testid="display-button"
            className="util-spacing will-hover"
            onClick={() => {
              dispatch(hideOrDisplayReply(reply.id, false));
            }}
          >
            <i className="far fa-eye"></i>
          </div>
        )}
      </div>
      {showDeleteModal && (
        <YesNoModal
          title="Delete Warnings!"
          message="Are you sure you want to delete this reply?"
          yes={() => {
            dispatch(deleteReply(reply.questionId, meetingId, reply.id));
            setIsEdit(false);
            setShowDeleteModal(false);
          }}
          no={() => {
            setIsEdit(false);
            setShowDeleteModal(false);
          }}
        />
      )}
      {showCancelModal && (
        <YesNoModal
          title="Warning!"
          message="Are you sure you want to discard the changes?"
          yes={() => {
            setIsEdit(false);
            setCancelModal(false);
          }}
          no={() => {
            setCancelModal(false);
          }}
        />
      )}
    </div>
  );
};
export default Reply;
