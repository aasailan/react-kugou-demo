/*
 * @Author: qiao 
 * @Date: 2018-12-13 14:04:48 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-13 14:53:16
 * 播放列表
 */
import { ISong } from '@/api/api';
import * as constants from '@/redux/constants';
import { createReducer } from '@/utils';
import { ISetPlayListAction, ISetPlayListIndexAction } from '../actions/playlist';

export interface IPlayListState {
  playIndex?: number;
  playList?: ISong[];
}

export const prePlayerListState: IPlayListState = {
  playIndex: 0,
  playList: []
};

const handlers = {
  [constants.SET_PLAY_LIST](state: IPlayListState, action: ISetPlayListAction): IPlayListState {
    const { payload } = action;
    return {
      playIndex: state.playIndex,
      playList: payload
    }
  },

  [constants.SET_PLAY_INDEX](state: IPlayListState, action: ISetPlayListIndexAction): IPlayListState {
    const { payload } = action;
    return {
      playIndex: payload,
      playList: state.playList
    };
  }
};

const playList = createReducer(prePlayerListState, handlers);
export default playList;