/*
 * @Author: qiao 
 * @Date: 2018-11-26 14:10:16 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-13 14:14:25
 * 合并root reducer
 */
import { combineReducers } from 'redux';
import { IStoreState } from '../store';
import audio from './audio';
import header from './header';
import player from './player';
import playList from './playlist';

export default combineReducers<IStoreState>({
  header,
  audio,
  player,
  playList
});

