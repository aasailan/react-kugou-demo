/*
 * @Author: qiao 
 * @Date: 2018-11-26 13:53:58 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-26 19:24:46
 * redux store状态
 */
import { applyMiddleware, compose, createStore } from 'redux'
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers';
import { IHeaderState, preHeaderState } from './reducers/header';
// import { ISetHeaderAction } from './actions/header';

const middlewares = [thunkMiddleware]

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger)
}

let composeEnhancers;
if (process.env.NODE_ENV !== 'production') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} else {
  composeEnhancers = compose;
}

export interface IStoreState {
  header: IHeaderState;
}

const preState: IStoreState = {
  header: preHeaderState
}

// interface IActions extends ISetHeaderAction {

// }

export default createStore<IStoreState, any, any, any>(reducer, preState, 
  composeEnhancers(applyMiddleware(...middlewares)))