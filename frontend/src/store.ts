import { createStore, combineReducers, compose, applyMiddleware, AnyAction } from 'redux'
import { createBrowserHistory } from 'history';
import { RouterState, connectRouter, routerMiddleware } from 'connected-react-router';
import thunk, { ThunkDispatch as OldThunkDispatch } from 'redux-thunk';


declare global {
  /* tslint:disable:interface-name */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  }
}

export type RootAction = AnyAction;

export type ThunkDispatch = OldThunkDispatch<RootState, null, RootAction>

export const history = createBrowserHistory();

export interface RootState {
  router: RouterState
}

const reducer = combineReducers<RootState>({
  router: connectRouter(history)
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer,
  composeEnhancers(
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunk)
  ));