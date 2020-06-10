import React, { useState } from 'react';
import './Home.scss';
import Button from 'react-bootstrap/Button';
import { convertCodeToId } from '../redux/rooms/thunk';
import { useDispatch } from 'react-redux';
import { message } from '../redux/rooms/actions';
// const form = useFormState()
export default function Home() {
  const [textValue, setTextValue] = useState('');
  const dispatch = useDispatch();
  return (
    <div>
      <div className="home-background">
        <div className="home-background-headings">
          <div className="home-background-headings-head">
            <h2>
              Grab comments from your Facebook & YouTube live streams at a
              glance.
            </h2>
            <h4>Hands UP is the tool you need to make it more interactive.</h4>
            <h6>Join NOW!</h6>
          </div>
          <span>
            <textarea
              placeholder="Your meeting code here"
              onChange={(e) => {
                setTextValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  if (textValue.trim().length > 0) {
                    dispatch(convertCodeToId(textValue));
                  } else {
                    dispatch(message(true, 'Code cannot be empty!'));
                  }
                }
              }}
            ></textarea>
          </span>
          <span className="home-background-enter-button-div">
            <Button
              onClick={() => {
                if (textValue.trim().length > 0) {
                  dispatch(convertCodeToId(textValue));
                } else {
                  dispatch(message(true, 'Code cannot be empty!'));
                }
              }}
              variant="info"
              className="home-background-enter-button"
            >
              Enter
            </Button>
          </span>
        </div>
        <div className="home-background-image-container">
          <img src="/test-bg.jpg" className="home-background-image"></img>
        </div>
      </div>
    </div>
  );
}
