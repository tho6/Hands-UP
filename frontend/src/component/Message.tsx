import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import './Message.scss'
import { message } from '../redux/rooms/actions';
import { push } from 'connected-react-router';

const Message: React.FC = () => {
  const messageStatus = useSelector(
    (rootState: RootState) => rootState.roomsInformation.message
  );
  const dispatch = useDispatch();
  useEffect(()=>{
    if(messageStatus.status){
      setTimeout(()=>{
        dispatch(message(false,messageStatus.message));
      },3000);
      if(messageStatus.redirect) dispatch(push(messageStatus.redirect));
    }
  },[dispatch, messageStatus])
  return (
    <div>
        <div className={`message-box p-2 ${messageStatus.status?'message-active':'message-inactive'}`}>{messageStatus.message}</div>
    </div>
  );
};

export default Message;
