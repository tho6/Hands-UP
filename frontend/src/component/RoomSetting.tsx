import React, { useState } from 'react';
import './RoomSetting.scss';
import { useFormState } from 'react-use-form-state';
import { IRoomConfiguration } from '../models/IRoomInformation';

interface IProps {
  roomConfig: IRoomConfiguration;
  // yes: () => void;
  // no: () => void;
}

const RoomSettingButton: React.FC<IProps> = (props) => {
  const { roomConfig } = props;
  console.log(roomConfig)
  const [formState, { text }] = useFormState({
    limit: `${roomConfig.questionLimit}`
  });
  if(formState){}
  const [showSetting, setShowSetting] = useState(false);
  return (
    <div>
      <div onClick={()=>setShowSetting(!showSetting)}>
        <i className="fas fa-cog fa-lg"></i>
      </div>
      {showSetting && (
        <div className="room-setting-container">
          <div className="d-flex py-2">
          <div>
            Moderation{' '}
            {roomConfig.canModerate ? (
              <i className="far fa-check-square"></i>
            ) : (
              <i className="far fa-square"></i>
            )}
          </div>
          <div className="pl-2">
            Upload files{' '}
            {roomConfig.canUploadFiles ? (
              <i className="far fa-check-square"></i>
            ) : (
              <i className="far fa-square"></i>
            )}
          </div>
          </div>
          <div className="py-2 break-div">
            <span>Question Rate <input className='input-text' {...text('limit')}/></span>
            <button className="room-update-save">Save</button>
          </div>
          <div className='py-2'>
          <button>Reset Facebook Platform</button>
          </div>
          <div className='py-2'>
          <button>Reset Youtube Platform</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSettingButton;
