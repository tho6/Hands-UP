import React from 'react';
import './App.css';
import QuestionPage from './component/QuestionPage';
import Question from './component/Question';
import { Route } from 'react-router-dom';
// import { Meetings } from './component/Meetings';
// import { MeetingRoom } from './component/MeetingRoom';
import { MeetingLive } from './component/MeetingLive';
import { MeetingPast } from './component/MeetingPast';
// import { Navbar } from './component/Navbar';

function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <Route path="/questions/room/:id/:page" exact>
        <QuestionPage />
      </Route>
      {/* <Route path="/" exact><Meetings /></Route>
      <Route path="/meetings/:id"><MeetingRoom /></Route> */}
      <MeetingLive />
      <div className="MeetingPast"><MeetingPast /></div>
    </div>
  );
}

export default App;
