import React from "react";
import './yesNoModal.scss'

interface IYesNoModalProps {
message:string;
title:string;
yes:()=>void;
no:()=>void;
}

const YesNoModal: React.FC<IYesNoModalProps> = (props) => {
  return (
    <>
    <div className='modal-background' onClick={props.no}></div>
  <div className='yes-no-modal mt-4' onClick={props.no}>
<div className='modal-container' onClick={(event)=>{event.stopPropagation()}}>
  <div className='modal-header'>{props.title}</div>
  <div className='modal-message p-2'>{props.message}</div>
<div className='d-flex justify-content-end p-2'>
  <div className='p-2'>
  <button className='confirm mx-2 rounded-pill' onClick={props.yes}>Confirm</button>
  <button className='mx-2 rounded-pill cancel' onClick={props.no}>Cancel</button>
  </div>
</div>
</div>
  </div>
  </>)
};

export default YesNoModal;
