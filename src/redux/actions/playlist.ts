/*
 * @Author: qiao 
 * @Date: 2018-12-13 14:05:15 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-13 14:30:02
 * 设置播放列表
 */
import { ISong } from '@/api/api';
import * as constants from '@/redux/constants';
import { CancelToken } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { IAction } from '.';
import { IStoreState } from '../store';
import { getSong, ISetAudioAction } from './audio';

export type ISetPlayListAction = IAction<constants.SET_PLAY_LIST, ISong[]>;

export function setPlayList(payload: ISong[]): ISetPlayListAction {
  return {
    type: constants.SET_PLAY_LIST,
    payload
  }
}

export type ISetPlayListIndexAction = IAction<constants.SET_PLAY_INDEX, number>;

export function setPlayListIndex(payload: number): ISetPlayListIndexAction {
  return {
    type: constants.SET_PLAY_INDEX,
    payload
  }
}

// 下一首
export type INextSongAction = ThunkAction<any, IStoreState, any, ISetPlayListIndexAction | ISetAudioAction>;
export const nextSong = (token: CancelToken): INextSongAction => async (dispatch, getState) => {
  const { playList: { playIndex, playList } } = getState();
  // 播放列表为空
  if (!playList || playList.length === 0 || playIndex === undefined) {
    return;
  }

  let index: number;
  // 循环播放
  if (playIndex === playList.length - 1) {
    index = 0;
  } else {
    index = playIndex + 1;
  }
  const song = playList[index];
  dispatch(setPlayListIndex(index));
  // NOTE: getSong返回一个异步函数，可以对它进行await 
  await dispatch(getSong(song.hash, token));
  console.log('切换成功');
};

// 上一首
export type IPrevSongAction = ThunkAction<any, IStoreState, any, ISetPlayListIndexAction | ISetAudioAction>;
export const prevSong = (token: CancelToken): IPrevSongAction => (dispatch, getState) => {
  const { playList: { playIndex, playList } } = getState();
  
  if (!playList || playList.length === 0 || playIndex === undefined) {
    return;
  }

  let index: number;
  // 循环播放
  if (playIndex === 0) {
    index = playList.length - 1;
  } else {
    index = playIndex - 1;
  }
  const song = playList[index];
  dispatch(setPlayListIndex(index));
  dispatch(getSong(song.hash, token));
}