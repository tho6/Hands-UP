import React, { useState } from 'react';
import './RoomSetting.scss';
import { useFormState } from 'react-use-form-state';
import { IRoomConfiguration } from '../models/IRoomInformation';
import Message from './Message';
import { useDispatch } from 'react-redux';
import { updateRoom, removeToken } from '../redux/rooms/thunk';

interface IProps {
  meetingId: number;
  roomConfig: IRoomConfiguration;
  // yes: () => void;
  // no: () => void;
}

const RoomSettingButton: React.FC<IProps> = (props) => {
  const { roomConfig, meetingId } = props;
  console.log(roomConfig);
  const [formState, { text }] = useFormState({
    limit: `${roomConfig.questionLimit}`
  });
  const [canUploadFile, setCanUpload] = useState(roomConfig.canUploadFile);
  const [canModerate, setCanModerate] = useState(roomConfig.canModerate);
  if (formState) {
  }
  const [showSetting, setShowSetting] = useState(false);
  const dispatch = useDispatch();
  return (
    <div>
      <div onClick={() => setShowSetting(!showSetting)}>
        <i className="fas fa-cog fa-lg"></i>
      </div>
      {showSetting && (
        <div className="room-setting-container">
          <div className="d-flex py-2">
            <div onClick={() => setCanModerate(!canModerate)}>
              Moderation{' '}
              {canModerate ? (
                <i className="far fa-check-square"></i>
              ) : (
                <i className="far fa-square"></i>
              )}
            </div>
            <div className="pl-2" onClick={() => setCanUpload(!canUploadFile)}>
              Upload files{' '}
              {canUploadFile ? (
                <i className="far fa-check-square"></i>
              ) : (
                <i className="far fa-square"></i>
              )}
            </div>
          </div>
          <div className="py-2 break-div">
            <span>
              Question Rate <input className="input-text" {...text('limit')} />
            </span>
            {(!formState.isPristine() ||
              canUploadFile !== roomConfig.canUploadFile ||
              canModerate !== roomConfig.canModerate) && (
              <button
                className="room-update-save"
                onClick={() => {
                  if (
                    !(formState.values.limit.trim().length > 0) ||
                    isNaN(formState.values.limit)
                  )
                    return window.alert('Invaid limit!');
                    
                  const updateRoomConfig = {
                    canUploadFile,
                    canModerate,
                    questionLimit: formState.values.limit
                  };
                  console.log(updateRoomConfig)
                  dispatch(updateRoom(meetingId, updateRoomConfig));
                  setShowSetting(false);
                }}
              >
                Save
              </button>
            )}
          </div>
          <div className="py-2">
            <button
              onClick={() => {
                dispatch(removeToken('facebook'));
                setShowSetting(false);
              }}
            >
              Reset Facebook Platform
            </button>
          </div>
          <div
            className="py-2"
            onClick={() => {
              dispatch(removeToken('youtube'));
              setShowSetting(false);
            }}
          >
            <button>Reset Youtube Platform</button>
          </div>
          <div
            className="py-2"
            onClick={() => {
              dispatch(removeToken('all'));
              setShowSetting(false);
            }}
          >
            <button>Reset All Platform</button>
          </div>
        </div>
      )}
      <Message />
    </div>
  );
};

export default RoomSettingButton;
