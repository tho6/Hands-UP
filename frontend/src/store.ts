import { createStore, combineReducers, compose, applyMiddleware, AnyAction } from 'redux'
import { createBrowserHistory } from 'history';
import { RouterState, connectRouter, routerMiddleware } from 'connected-react-router';
import thunk, { ThunkDispatch as OldThunkDispatch } from 'redux-thunk';
import { QuestionsActions } from './redux/questions/actions';
import { QuestionState, questionsReducer } from './redux/questions/reducers';


declare global {
  /* tslint:disable:interface-name */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  }
}

export type RootAction = QuestionsActions;

export type ThunkDispatch = OldThunkDispatch<RootState, null, RootAction>

export const history = createBrowserHistory();

export interface RootState {
  questions: QuestionState
  router: RouterState
}

const reducer = combineReducers<RootState>({
  questions: questionsReducer,
  router: connectRouter(history)
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer,
  composeEnhancers(
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunk)
  ));