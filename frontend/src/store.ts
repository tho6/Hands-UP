import { createStore, combineReducers, compose, applyMiddleware, AnyAction } from 'redux'
import { createBrowserHistory } from 'history';
import { RouterState, connectRouter, routerMiddleware } from 'connected-react-router';
import thunk, { ThunkDispatch as OldThunkDispatch } from 'redux-thunk';
import { QuestionsActions } from './redux/questions/actions';
import { QuestionState, questionsReducer } from './redux/questions/reducers';
import { roomsReducer, RoomState } from './redux/rooms/reducers';
import { RoomsActions } from './redux/rooms/actions';
import { AuthState, authReducer } from './redux/auth/reducers';
import { AuthActions } from './redux/auth/actions';
import { MeetingPastActions } from './redux/meetingpast/action';
import { MeetingPastState, MeetingPastReducer } from './redux/meetingpast/reducers';
import { MeetingLiveState, MeetingLiveReducer } from './redux/meetinglive/reducers';
import { ReportState, reportReducer } from './redux/report/reducers';
import { ReportActions } from './redux/report/actions';
import { MainNavActions } from './redux/mainNav/actions';
import { MainNavState, mainNavReducer } from './redux/mainNav/reducers';


declare global {
  /* tslint:disable:interface-name */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  }
}
// export type RootAction = QuestionsActions|RoomsActions|AuthActions;

export type RootAction = AnyAction | QuestionsActions | RoomsActions | MeetingPastActions | ReportActions | AuthActions | MainNavActions; // this

export type ThunkDispatch = OldThunkDispatch<RootState, null, RootAction>

export const history = createBrowserHistory();

export interface RootState {
  auth: AuthState
  questions: QuestionState
  roomsInformation: RoomState
  router: RouterState
  meetingsPast: MeetingPastState,
  meetingsLive: MeetingLiveState,
  report: ReportState,
  mainNav: MainNavState
}

const reducer = combineReducers<RootState>({
  auth: authReducer,
  // auth: () => null,
  questions: questionsReducer,
  roomsInformation: roomsReducer,
  router: connectRouter(history),
  meetingsPast: MeetingPastReducer,
  meetingsLive: MeetingLiveReducer,
  report: reportReducer,
  mainNav: mainNavReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer,
  composeEnhancers(
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunk)
  ));