/*
 * @Author: qiao 
 * @Date: 2018-11-26 17:12:27 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-12 19:22:30
 * header相关actions
 */
import * as constants from '@/redux/constants'
import { IHeaderState } from '@/redux/reducers/header';
import { IAction } from '.';

// export interface ISetHeaderAction {
//   type: constants.SET_HEADER;
//   payload: IHeaderState;
// }

export type ISetHeaderAction = IAction<constants.SET_HEADER, IHeaderState>;

// action creator
export function setHeader(payload: IHeaderState): ISetHeaderAction {
  return {
    type: constants.SET_HEADER,
    payload
  };
}
