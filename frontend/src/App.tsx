import React, { useEffect } from 'react';
import './App.scss';
import QuestionPage from './component/QuestionPage';
import { Route, Switch } from 'react-router-dom';
import Meetings from './component/Meetings';
// import GoogleLogin from './component/GoogleLogin';
import GoogleLoginCallBack from './component/GoogleLoginCallBack';
import { useDispatch, useSelector } from 'react-redux';
import {RootState } from './store';
import { checkToken, restoreLogin } from './redux/auth/thunk';
import FacebookLoginCallBack from './component/FacebookLoginCallBack';
import Home from './component/Home';
import { Report } from './component/Report';
import YoutubeCallBack from './component/YoutubeCallBack';
import ReportOverall from './component/ReportOverall';
import {ReportPast} from './component/ReportPast'
import Navbar from './component/Navbar';
import { ViewsChartZoomable } from './component/ViewsChartZoomable';
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
  const isMove = useSelector((state:RootState)=>state.mainNav.isOpen)
  return (
    <>
    <Navbar />
    <div className={`App ${isMove?'navbar-move':''}`}>
        <Switch>
          <Route path="/" exact>
          <Home />
          </Route>
          <Route path="/room/:id/questions/:page/:fb?" exact>
          {(isAuthenticated != null &&<QuestionPage />)}
          </Route>
          <Route path="/meetings" exact>
          {(isAuthenticated != null && <Meetings />)}
          </Route>
          <Route path="/report/past" exact>
          {(isAuthenticated != null &&<ReportPast />)}
          </Route>
          <Route path="/report/:loc" exact>
          {(isAuthenticated != null &&<Report />)}
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
          <Route path="/zoom" exact>
          {(isAuthenticated != null && <ViewsChartZoomable />)}
          </Route>
        </Switch>

      {/* <FacebookLogin /> */}
      
    </div>
    </>
  );
}

export default App;