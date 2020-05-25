import { createStore, combineReducers, compose, applyMiddleware, AnyAction } from 'redux'
import { createBrowserHistory } from 'history';
import { RouterState, connectRouter, routerMiddleware } from 'connected-react-router';
import thunk, { ThunkDispatch as OldThunkDispatch } from 'redux-thunk';
import { QuestionsActions } from './redux/questions/actions';
import { QuestionState, questionsReducer } from './redux/questions/reducers';
import { roomsReducer, RoomState } from './redux/rooms/reducers';
import { RoomsActions } from './redux/rooms/actions';
import { MeetingPastActions } from './redux/meetingpast/action';
import { MeetingPastState, MeetingPastReducer } from './redux/meetingpast/reducers';
import { MeetingLiveState, MeetingLiveReducer } from './redux/meetinglive/reducers';


declare global {
  /* tslint:disable:interface-name */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  }
}

export type RootAction = QuestionsActions | RoomsActions | MeetingPastActions;

export type ThunkDispatch = OldThunkDispatch<RootState, null, RootAction>

export const history = createBrowserHistory();

export interface RootState {
  auth: any
  questions: QuestionState
  roomsInformation: RoomState
  router: RouterState
  meetingsPast: MeetingPastState,
  meetingsLive: MeetingLiveState,
}

const reducer = combineReducers<RootState>({
  auth: () => null,
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