/*
 * @Author: qiao 
 * @Date: 2018-12-12 09:11:17 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-12 19:01:36
 * 歌曲播放action
 */
import Api from '@/api';
import * as constants from '@/redux/constants';
import { CancelToken } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { IAction } from '.';
import { IAudioState } from '../reducers/audio';
import { IStoreState } from '../store';
import { ISetPlayerAction, setPlayer } from './player';

export type ISetAudioAction = IAction<constants.SET_AUDIO, IAudioState>;

// action creator
export function setAudio(payload: IAudioState): ISetAudioAction {
  return {
    type: constants.SET_AUDIO,
    payload
  };
}

// redux-thunk 中间件 
export type IGetSongAction = ThunkAction<Promise<void>, IStoreState, null, ISetAudioAction | ISetPlayerAction>
export const getSong = (songHash: string, 
  token?: CancelToken): IGetSongAction => 
  async (dispatch) => {
    try {
      // 设置加载歌曲开始
      dispatch(setPlayer({ loading: true }));

      const { data: { data } } = await Api.getSongInfo({ hash: songHash }, token);
      const audio: IAudioState = {
        title: data.audio_name,
        songUrl: data.play_url,
        imgUrl: data.img,
        songLength: data.timelength / 1000,
        singer: data.author_name,
        currentLength: 0,
        changeProgress: false,
        lrc: data.lyrics,
        songHash
      };
      dispatch(setAudio(audio));
    } catch (e) {
      console.error(e);
      // NOTE: 在action里面发生error怎么办
    } finally {
      // 设置加载歌曲完毕
      dispatch(setPlayer({ loading: false }));
    }
  }
