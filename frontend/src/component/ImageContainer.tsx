import React from 'react';
import './ImageContainer.scss';

interface IProps {
  fileName: string;
  no: () => void;
}

const ImageContainer: React.FC<IProps> = (props) => {
  const { fileName } = props;
  return (
    <div className="modal-background  d-flex justify-content-center align-items-center" onClick={props.no}>
      <div className="image-container">
        <img
          className="img-zoom"
          src={`${fileName}`}
          alt={fileName}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
      </div>
    </div>
  );
};

export default ImageContainer;
