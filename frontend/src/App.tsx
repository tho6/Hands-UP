import React, { useEffect } from 'react';
import './App.scss';
import QuestionPage from './component/QuestionPage';
import { Route, Switch } from 'react-router-dom';
import Meetings from './component/Meetings';
// import CreateMeeting from './component/MeetingCreate';
import GoogleLogin from './component/GoogleLogin';
import GoogleLoginCallBack from './component/GoogleLoginCallBack';
import { useDispatch, useSelector } from 'react-redux';
import {RootState } from './store';
import { checkToken, restoreLogin } from './redux/auth/thunk';
import FacebookLoginCallBack from './component/FacebookLoginCallBack';
import Home from './component/Home';
import { Report } from './component/Report';
import YoutubeCallBack from './component/YoutubeCallBack';
import ReportOverall from './component/ReportOverall';
// import FacebookLogin from './component/FacebookLogin';
// import FacebookLogin from './component/FacebookLogin';

function App() {
  const dispatch = useDispatch()
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  // useEffect(() => {
  //   dispatch(checkToken())
  //   console.log('app dispatch')
  // }, [dispatch,accessToken])
  useEffect(() => {
    dispatch(checkToken())
    dispatch(restoreLogin())
    console.log('restore login')
  }, [dispatch, accessToken])
  
  const isAuthenticated = useSelector((state:RootState)=>state.auth.isAuthenticated)
  return (
    <div className="App">
        <Switch>
          <Route path="/" exact>
          <Home />
          </Route>
          <Route path="/room/:id/questions/:page" exact>
          {(isAuthenticated != null &&<QuestionPage />)}
          </Route>
          <Route path="/meetings" exact>
          {(isAuthenticated != null && <Meetings />)}
          </Route>
          {/* <Route path="/meetings/create" exact>
          {(isAuthenticated != null && <CreateMeeting />)}
          </Route> */}
          <Route path="/report/:loc" exact>
          {(isAuthenticated != null &&<Report />)}
          </Route>
          <Route path="/googleLogin" exact>
          {(isAuthenticated != null &&<GoogleLogin />)}
          </Route>
          <Route path="/googleLogin/callback" exact>
          {(isAuthenticated != null &&<GoogleLoginCallBack />)}
          </Route>
          <Route path="/youtube/callback" exact>
          {(isAuthenticated != null &&<YoutubeCallBack />)}
          </Route>
          <Route path="/facebookLogin/callback" exact>
          {(isAuthenticated != null &&<FacebookLoginCallBack />)}
          </Route>
          <Route path="/testing/:lastXMeetings" exact>
          {(isAuthenticated != null && <ReportOverall />)}
          </Route>
        </Switch>

      {/* <FacebookLogin /> */}
      
    </div>
  );
}

export default App;