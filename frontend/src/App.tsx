import React from 'react';
import logo from './logo.svg';
import './App.css';
import QuestionPage from './component/QuestionPage';
import Question from './component/Question';
import { Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
       <Route path="/questions/room/:id" exact>
      <QuestionPage user={{id:1, name:'Anonymous', isHost:false}} canUploadFiles={false} rate={10} isModerate={false}/>
       </Route>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
