<<<<<<< HEAD
import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import QuestionPage from './component/QuestionPage';
import Question from './component/Question';
import { Route, Switch } from 'react-router-dom';
import GoogleLogin from './component/GoogleLogin';
import GoogleLoginCallBack from './component/GoogleLoginCallBack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './store';
import { checkToken, restoreLogin } from './redux/auth/thunk';
import FacebookLogin from './component/FacebookLogin'
import FacebookLoginCallBack from './component/FacbookLoginCallBack';

=======
import React from 'react';
import './App.css';
import QuestionPage from './component/QuestionPage';
import Question from './component/Question';
import { Route } from 'react-router-dom';
// import { Meetings } from './component/Meetings';
// import { MeetingRoom } from './component/MeetingRoom';
import { MeetingLive } from './component/MeetingLive';
import { MeetingPast } from './component/MeetingPast';
import { Nav } from './component/Nav';
>>>>>>> 9627f370cfabb69e8666393bf62c04939abca631

function App() {
  const dispatch = useDispatch()
  const accessToken = useSelector((state:RootState) => state.auth.accessToken)
  useEffect(()=>{
    dispatch(checkToken())
    // dispatch(restoreLogin())
    console.log('app dispatch')
  }, [dispatch, accessToken])
  return (
    <div className="App">
<<<<<<< HEAD
      <Provider store={store}>
        
      <Switch>
       <Route path="/questions/room/:id/:page" exact>
        <QuestionPage />
       </Route>
       <Route path="/googleLogin" exact><GoogleLogin /></Route>
       <Route path="/googleLogin/callback"><GoogleLoginCallBack /></Route>
       <Route path="/facebookLogin/callback"><FacebookLoginCallBack /></Route>
      </Switch>
      </Provider>
      <FacebookLogin />
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
=======
      {/* <Nav /> */}
      <Route path="/questions/room/:id/:page" exact>
        <QuestionPage />
      </Route>
      {/* <Route path="/" exact><Meetings /></Route>
      <Route path="/meetings/:id"><MeetingRoom /></Route> */}
      <MeetingLive />
      <div className="MeetingPast"><MeetingPast /></div>
>>>>>>> 9627f370cfabb69e8666393bf62c04939abca631
    </div>
  );
}

export default App;
