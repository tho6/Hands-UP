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
  const canEdit = reply.guestId === user?.guestId;
  const dispatch = useDispatch();
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
          <div className='to-center'>
            <span
              className="util-spacing"
              onClick={() => {
                dispatch(editReply(user?.guestId!,reply.id,'formState.values.edit'));
                setIsEdit(false);
              }}
            >
              <i className="fas fa-cloud-upload-alt"></i>
            </span>
            <span
              className="util-spacing"
              onClick={() => {
                dispatch(deleteReply(reply.questionId, meetingId, reply.id ))
                setShowDeleteModal(true);
              }}
            >
              <i className="fas fa-trash-alt"></i>
            </span>
            <span
              className="util-spacing"
              onClick={() => {
                setIsEdit(false);
              }}
            >
              <i className="fas fa-ban"></i>
            </span>
          </div>
        )}
      </div>
      <YesNoModal
        title="Delete a reply"
        message="Are you sure to delete this reply?"
        yes={() => {
          setShowDeleteModal(false);
          setIsEdit(false);
        }}
        no={() => {
          setShowDeleteModal(false);
          setIsEdit(false);
        }}
      ></YesNoModal>
    </div>
  );
}
