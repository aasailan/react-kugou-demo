/*
 * @Author: qiao 
 * @Date: 2018-12-12 19:06:25 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-12 19:26:35
 * 播放界面状态，正在加载、是否显示详情播放页面
 */
import * as constants from '@/redux/constants';
import { createReducer } from '@/utils';
import { ISetPlayerAction } from '../actions';

export interface IPlayerState {
  // 是否正在加载歌曲
  loading?: boolean;
  // 是否正在显示播放详情页
  showDetailPlayer?: boolean;
  // 是否暂停
  pause?: boolean;
}

export const prePlayerState: IPlayerState = {
  loading: false,
  showDetailPlayer: false,
  pause: false
};

const handlers = {
  [constants.SET_PLAYER](state: IPlayerState, 
    action: ISetPlayerAction): IPlayerState {
    const { payload } = action;
    return {
      ...state,
      ...payload
    };
  }
};

const player = createReducer(prePlayerState, handlers);
export default player;
