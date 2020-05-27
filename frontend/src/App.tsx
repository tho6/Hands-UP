import React, { useEffect } from 'react';
import './App.css';
import QuestionPage from './component/QuestionPage';
import Question from './component/Question';
import { Route, Switch } from 'react-router-dom';
import Meetings from './component/Meetings';
import CreateMeeting from './component/MeetingCreate';
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
  useEffect(() => {
    dispatch(restoreLogin())
    // dispatch(restoreLogin())
    console.log('restore login in APP')
  }, [dispatch])
  const isAuthenticated = useSelector((state:RootState)=>state.auth.isAuthenticated)
  return (
    <div className="App">

      <Provider store={store}>

        <Switch>
          <Route path="/questions/room/:id/:page" exact>
          {(isAuthenticated != null &&<QuestionPage />)}
          </Route>
          <Route path="/meetings" exact>
          {(isAuthenticated != null && <Meetings />)}
          </Route>
          <Route path="/meetings/create" exact>
          {(isAuthenticated != null && <CreateMeeting />)}
          </Route>
          <Route path="/googleLogin" exact>
          {(isAuthenticated != null &&<GoogleLogin />)}
          </Route>
          <Route path="/googleLogin/callback">
          {(isAuthenticated != null &&<GoogleLoginCallBack />)}
          </Route>
          <Route path="/facebookLogin/callback">
          {(isAuthenticated != null &&<FacebookLoginCallBack />)}</Route>
        </Switch>
      </Provider>
      <FacebookLogin />
      
    </div>
  );
}

export default App;