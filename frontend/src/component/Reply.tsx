import React, { useState } from 'react';
import { reply } from '../models/IQuestion';
import { useFormState } from 'react-use-form-state';
import { IUserQ, IGuest } from '../models/IUserQ';
import YesNoModal from './YesNoModal';
import { useDispatch } from 'react-redux';
import { editReply, deleteReply } from '../redux/questions/thunk';

export interface IReplyProps {
  reply: reply;
  user: (IUserQ & IGuest) | null;
  meetingId: number;
}

export function Reply(props: IReplyProps) {
  const { reply, user, meetingId } = props;
  const [formState, { textarea }] = useFormState();
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setCancelModal] = useState(false);
  const canEdit = reply.guestId === user?.guestId;
  const dispatch = useDispatch();
  const backupValue = reply.content;
  return (
    <div className="reply mb-3">
      <div className="content pb-2 pt-2">
        {isEdit ? (
          <textarea className="mb-2 rounded" {...textarea('edit')}></textarea>
        ) : (
          reply.content
        )}
      </div>
      <div className="d-flex justify-content-sm-end justify-content-start">
        <div className="to-center util-spacing">{reply.guestName}</div>
        {canEdit && !isEdit && (
          <div
            className="util-spacing"
            onClick={() => {
              formState.setField('edit', reply.content);
              setIsEdit(true);
            }}
          >
            <i className="fas fa-pencil-alt"></i>
          </div>
        )}
        {canEdit && isEdit && (
          <div className="to-center">
            <span
              className="util-spacing"
              onClick={() => {
                if (
                  backupValue !== formState.values.edit &&
                  formState.values.edit.trim()
                ) {
                  dispatch(
                    editReply(user?.guestId!, reply.id, formState.values.edit),
                  );
                  setIsEdit(false);
                } else if (!formState.values.edit.trim()) {
                  window.alert('Empty reply is not allowed!');
                } else {
                  setIsEdit(false);
                }
              }}
            >
              <i className="fas fa-cloud-upload-alt"></i>
            </span>
            <span
              className="util-spacing"
              onClick={() => {
                setShowDeleteModal(true);
              }}
            >
              <i className="fas fa-trash-alt"></i>
            </span>
            <span
              className="util-spacing"
              onClick={() => {
                formState.values.edit === reply.content
                  ? setIsEdit(false)
                  : setCancelModal(true);
              }}
            >
              <i className="fas fa-ban"></i>
            </span>
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
}
