import React, { useState } from 'react';
import { reply } from '../models/IQuestion';
import { useFormState } from 'react-use-form-state';
import { IGuest } from '../models/IUserQ';
import YesNoModal from './YesNoModal';
import { useDispatch } from 'react-redux';
import {
  editReply,
  deleteReply,
  hideOrDisplayReply
} from '../redux/questions/thunk';

export interface IReplyProps {
  reply: reply;
  user: IGuest | null | undefined;
  meetingId: number;
}

const Reply: React.FC<IReplyProps> = (props) => {
  const { reply, user, meetingId } = props;
  const [formState, { textarea }] = useFormState();
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setCancelModal] = useState(false);
  const canEdit = reply.guestId === user?.guestId || user?.isHost;
  const dispatch = useDispatch();
  const backupValue = reply.content;
  return (
    <div className="reply mb-3">
      <div className="content pb-2 pt-2">
        {isEdit ? (
          <textarea
            data-testid="text-area"
            className="mb-2 rounded"
            {...textarea('edit')}
          ></textarea>
        ) : (
          reply.content
        )}
      </div>
      {(!isEdit) && (new Date(reply.createdAt).getTime() !== new Date(reply.updatedAt).getTime()) && (
        <span data-testid="edited-sign">[Edited]</span>
      )}
      <div className="d-flex justify-content-sm-end justify-content-start">
        <div className="to-center util-spacing">{reply.guestName}</div>
        {canEdit && !isEdit && (
          <div
            className="util-spacing will-hover"
            onClick={() => {
              formState.setField('edit', reply.content);
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
                if (
                  backupValue !== formState.values.edit &&
                  formState.values.edit.trim()
                ) {
                  dispatch(
                    editReply(user?.guestId!, reply.id, formState.values.edit)
                  );
                  setIsEdit(false);
                } else if (!formState.values.edit.trim()) {
                  window.alert('Empty reply is not allowed!');
                } else {
                  setIsEdit(false);
                }
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
                formState.values.edit === reply.content
                  ? setIsEdit(false)
                  : setCancelModal(true);
              }}
            >
              <i className="fas fa-ban" data-testid="cancel-button"></i>
            </span>
          </div>
        )}
        {user?.isHost && !reply.isHide && (
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
        {user?.isHost && reply.isHide && (
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
