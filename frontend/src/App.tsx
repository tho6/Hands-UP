import React, { useEffect } from 'react';
import './App.css';
import QuestionPage from './component/QuestionPage';
import Question from './component/Question';
import { Route, Switch } from 'react-router-dom';
import { MeetingLive } from './component/MeetingLive';
import { MeetingPast } from './component/MeetingPast';
// import { Navbar } from './component/Navbar';
import GoogleLogin from './component/GoogleLogin';
import GoogleLoginCallBack from './component/GoogleLoginCallBack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './store';
import { checkToken, restoreLogin } from './redux/auth/thunk';
import FacebookLogin from './component/FacebookLogin'
import FacebookLoginCallBack from './component/FacebookLoginCallBack';

function App() {
  const dispatch = useDispatch()
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  useEffect(() => {
    dispatch(checkToken())
    // dispatch(restoreLogin())
    console.log('app dispatch')
  }, [dispatch, accessToken])
  return (
    <div className="App">
      <Provider store={store}>

        <Switch>
          <Route path="/questions/room/:id/:page" exact>
            <QuestionPage />
          </Route>
          <Route path="/meetings/live" exact>
            <MeetingLive />
          </Route>
          <Route path="/meetings/past" exact>
            <MeetingPast />
          </Route>
          <Route path="/googleLogin" exact><GoogleLogin /></Route>
          <Route path="/googleLogin/callback"><GoogleLoginCallBack /></Route>
          <Route path="/facebookLogin/callback"><FacebookLoginCallBack /></Route>
        </Switch>
      </Provider>
      <FacebookLogin />
    </div>
  );
}

export default App;
