/*
 * @Author: qiao 
 * @Date: 2018-12-12 19:15:23 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-12 19:18:20
 */
import * as constants from '@/redux/constants';
import { IAction } from '.';
import { IPlayerState } from '../reducers/player';

export type ISetPlayerAction = IAction<constants.SET_PLAYER, IPlayerState>;

export function setPlayer(payload: IPlayerState): ISetPlayerAction {
  return {
    type: constants.SET_PLAYER,
    payload
  };
}