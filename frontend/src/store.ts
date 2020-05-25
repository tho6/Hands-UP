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


declare global {
  /* tslint:disable:interface-name */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  }
}
export type RootAction = AnyAction
// export type RootAction = QuestionsActions|RoomsActions|AuthActions;

export type ThunkDispatch = OldThunkDispatch<RootState, null, RootAction>

export const history = createBrowserHistory();

export interface RootState {
  auth: AuthState
  questions: QuestionState
  roomsInformation: RoomState
  router: RouterState
}

const reducer = combineReducers<RootState>({
  auth: authReducer,
  questions: questionsReducer,
  roomsInformation: roomsReducer,
  router: connectRouter(history)
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer,
  composeEnhancers(
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunk)
  ));