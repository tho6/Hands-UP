import { createStore, combineReducers, compose, applyMiddleware, AnyAction } from 'redux'
import { createBrowserHistory } from 'history';
import { RouterState, connectRouter, routerMiddleware } from 'connected-react-router';
import thunk, { ThunkDispatch as OldThunkDispatch } from 'redux-thunk';
import { QuestionsActions } from './redux/questions/actions';
import { QuestionState, questionsReducer } from './redux/questions/reducers';
import { roomsReducer, RoomState } from './redux/rooms/reducers';
import { RoomsActions } from './redux/rooms/actions';
<<<<<<< HEAD
import { AuthState, authReducer } from './redux/auth/reducers';
import { AuthActions } from './redux/auth/actions';
=======
import { MeetingPastActions } from './redux/meetingpast/action';
import { MeetingPastState, MeetingPastReducer } from './redux/meetingpast/reducers';
import { MeetingLiveState, MeetingLiveReducer } from './redux/meetinglive/reducers';
>>>>>>> 9627f370cfabb69e8666393bf62c04939abca631


declare global {
  /* tslint:disable:interface-name */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  }
}
<<<<<<< HEAD
export type RootAction = AnyAction
// export type RootAction = QuestionsActions|RoomsActions|AuthActions;
=======

export type RootAction = QuestionsActions | RoomsActions | MeetingPastActions;
>>>>>>> 9627f370cfabb69e8666393bf62c04939abca631

export type ThunkDispatch = OldThunkDispatch<RootState, null, RootAction>

export const history = createBrowserHistory();

export interface RootState {
<<<<<<< HEAD
  auth: AuthState
=======
  auth: any
>>>>>>> 9627f370cfabb69e8666393bf62c04939abca631
  questions: QuestionState
  roomsInformation: RoomState
  router: RouterState
  meetingsPast: MeetingPastState,
  meetingsLive: MeetingLiveState,
}

const reducer = combineReducers<RootState>({
<<<<<<< HEAD
  auth: authReducer,
=======
  auth: () => null,
>>>>>>> 9627f370cfabb69e8666393bf62c04939abca631
  questions: questionsReducer,
  roomsInformation: roomsReducer,
  router: connectRouter(history),
  meetingsPast: MeetingPastReducer,
  meetingsLive: MeetingLiveReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer,
  composeEnhancers(
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunk)
  ));