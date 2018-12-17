/*
 * @Author: qiao 
 * @Date: 2018-11-26 13:53:58 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-12 19:32:47
 * redux store状态
 */
import { applyMiddleware, compose, createStore } from 'redux'
// import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers';
import { IAudioState, preAudioState } from './reducers/audio';
import { IHeaderState, preHeaderState } from './reducers/header';
import { IPlayerState, prePlayerState } from './reducers/player';
import { IPlayListState, prePlayerListState } from './reducers/playlist';
// import { ISetHeaderAction } from './actions/header';

const middlewares = [thunkMiddleware]

if (process.env.NODE_ENV !== 'production') {
  // middlewares.push(logger)
}

let composeEnhancers;
if (process.env.NODE_ENV !== 'production') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} else {
  composeEnhancers = compose;
}

export interface IStoreState {
  header: IHeaderState; // header数据
  audio: IAudioState; // 播放数据
  player: IPlayerState; // 播放器状态
  playList: IPlayListState; // 播放列表
}

const preState: IStoreState = {
  header: preHeaderState,
  audio: preAudioState,
  player: prePlayerState,
  playList: prePlayerListState
}

export default createStore<IStoreState, any, any, any>(
  reducer, 
  preState, 
  composeEnhancers(applyMiddleware(...middlewares))
);
