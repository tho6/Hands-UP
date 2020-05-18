import React, { useState } from "react";
import { IQuestion } from "../models/IQuestion";
import "./question.scss";
import YesNoModal from "./YesNoModal";
import { useDispatch } from "react-redux";
import { deleteQuestion, editQuestionPlainText } from "../redux/questions/thunk";
import { useFormState } from "react-use-form-state";

interface IQuestionProps {
  question: IQuestion;
  user: { id: number; isHost: boolean; name: string };
  canUploadFiles: boolean;
  answering: boolean;
}

const Question: React.FC<IQuestionProps> = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [formState, { textarea }] = useFormState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const canEdit =
    props.user.isHost || props.user.id === props.question.questioner.id
      ? true
      : false;
  const dispatch = useDispatch();

  return (
    <div className="mb-4 d-flex">
      <div className="question flex-grow-1">
        <div className="d-flex question-content-area">
          <div className="content text-wrap p-2">
            {isEdit ? (
              <textarea className='p-2 rounded' {...textarea("content")}></textarea>
            ) : (
              props.question.content
            )}
          </div>
          {props.answering === true && <span className="p-2">Answering</span>}
        </div>
        <div className="image-area p-2 text-left d-flex flex-wrap">
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
        <div className="d-flex justify-content-between util-container">
          <div className="d-flex p-2">
            <div className="p-2 mx-sm-4 mx-lg-5">
              <i className="far fa-thumbs-up"></i> {props.question.likes}
            </div>
            <div className="p-2 ml-sm-4 ml-lg-5">
              <i className="far fa-comment"></i> [
              {props.question.replies.length}]
            </div>
          </div>
          <div className="d-flex p-2">
            <div className="p-2 mx-sm-3">{props.question.questioner.name}</div>
            {isEdit && (
              <>
                <div className="p-2 mx-sm-3" onClick={()=>{
                  setShowSaveModal(true);
                }}>
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <div
                  className="p-2 mx-sm-3"
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="fas fa-trash-alt"></i>
                </div>
                <div className="p-2 mx-sm-3" onClick={() => setShowCancelModal(true)}>
                  <i className="fas fa-ban"></i>
                </div>
              </>
            )}
            {!isEdit && canEdit && (
              <div
                className="p-2 mx-sm-3"
                onClick={() => {
                  formState.setField('content',props.question.content) 
                  setIsEdit(true);
                }}
              >
                <i className="fas fa-pencil-alt"></i>
              </div>
            )}

            <div className="p-2 ml-sm-3">
              <i className="fas fa-reply"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 platform-icon">
        <i className="fab fa-facebook fa-lg"></i>
      </div>
      {showDeleteModal && (
        <YesNoModal
          title="Delete Warnings!"
          message="Are you sure you want to delete this question?"
          yes={() => {
            dispatch(
              deleteQuestion(props.question.id, props.question.meetingId)
            );
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
          message="Are you sure you want to discard your changes?"
          yes={() => {
            setShowCancelModal(false);
            setIsEdit(false);
          }}
          no={() => {
            setShowCancelModal(false);
          }}
        />
      )}
        {showSaveModal && (
        <YesNoModal
          title="Save"
          message="Save Changes?"
          yes={() => {
            if(!formState.values.content.trim()){
              window.alert('Question cannot be empty!');
              return;
            }
            dispatch(
              editQuestionPlainText(props.question.id, formState.values.content)
            );
            setShowSaveModal(false);
            setIsEdit(false);
          }}
          no={() => {
            setShowSaveModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Question;
