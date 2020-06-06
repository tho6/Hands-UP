import React from 'react';
import './Loading.scss';
import Spinner from 'react-bootstrap/Spinner';


const Loading: React.FC= () => {
  return (
    <div className="loading-background d-flex justify-content-end align-items-end">
      <div className='loading-container d-flex'>
        <div className='p-5'>
        <Spinner animation="grow" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
