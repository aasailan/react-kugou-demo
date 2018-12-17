/*
 * @Author: qiao 
 * @Date: 2018-11-26 17:08:16 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-13 16:08:14
 * actions NOTE: 暂时没发现这个文件有什么用
 */
// import * as constants from '@/redux/constants';
import { Action } from 'redux';

export interface IAction<T = any, P = any> extends Action<T> {
  // type: T;
  payload: P;
}

export * from './header';
export * from './audio';
export * from './player';
export * from './playlist';