/*
 * @Author: qiao 
 * @Date: 2018-11-26 17:01:41 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-26 18:42:44
 * headerbar状态
 */
import { ISetHeaderAction } from '@/redux/actions/header';
import * as constants from '@/redux/constants'
import { createReducer } from '@/utils';

export interface IHeaderState {
  isShow?: boolean;
  title?: string;
  bg?: string;
}

export const preHeaderState: IHeaderState = {
  isShow: true,
  title: '标题',
  bg: 'rgba(43,162,251,0)'
};

const handlers = {
  [constants.SET_HEADER](state: IHeaderState, action: ISetHeaderAction): IHeaderState {
    const { payload } = action; 
    return {
      ...state,
      ...payload
    };
  }
};

const header = createReducer(preHeaderState, handlers);

export default header;

// 原始reducer
// export default function header(state: IHeaderState = headerState, action: any): IHeaderState {
//   const { type, payload } = action
//   switch (type) {
//     case constants.SET_HEADER:
//       return {
//         ...payload
//       };
//     case constants.SET_HEADER_TITLE:
//       return {
//         ...state,
//         title: payload
//       };
//     case constants.SET_HEADER_BG:
//       return {
//         ...state,
//         bg: payload
//       }
//     default:
//       return state;
//   }
// }

