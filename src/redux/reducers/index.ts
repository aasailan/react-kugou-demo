/*
 * @Author: qiao 
 * @Date: 2018-11-26 14:10:16 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-26 18:33:54
 * 合并root reducer
 */
import { combineReducers } from 'redux';
import header from './header';

export default combineReducers({
  header
});

