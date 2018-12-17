/*
 * @Author: qiao 
 * @Date: 2018-12-12 08:58:43 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-13 16:30:16
 * 播放数据存储
 */
import * as constants from '@/redux/constants';
import { createReducer } from '@/utils';
import { IAction } from '../actions';

// 播放 NOTE: AudioState 接口的所有属性都可能是undefine，如何解决这个问题
export interface IAudioState {
  songHash?: string;
  // 歌曲文件url
  songUrl?: string;
  // 歌曲url
  imgUrl?: string;
  // 歌曲名称
  title?: string;
  // 歌手
  singer?: string;
  // 当前播放进度
  currentLength?: number;
  // 歌曲时间长度
  songLength?: number;
  // 是否被拖动了时间条 currentFlag
  changeProgress?: boolean;
  // 歌词
  lrc?: string;
}

export const preAudioState: IAudioState = {
  songUrl: '',
  imgUrl: 'http://m.kugou.com/v3/static/images/index/logo_kugou.png',
  title: '',
  singer: '',
  currentLength: 0,
  songLength: 0,
  changeProgress: false,
  lrc: ''
};

// NOTE: 消灭样板代码
const handlers = {
  [constants.SET_AUDIO](state: IAudioState, 
    action: IAction<constants.SET_AUDIO, IAudioState>): IAudioState {
    const { payload } = action;
    return {
      ...state,
      ...payload
    };
  }
};

const audio = createReducer(preAudioState, handlers);

export default audio;
