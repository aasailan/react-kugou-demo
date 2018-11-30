/*
 * @Author: qiao 
 * @Date: 2018-11-25 15:21:47 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-25 15:33:19
 * 加载组件
 */
import loadingSVG from '@/assets/imgs/loading.svg';
import React from 'react';
import './loading.scss';

export default function Loading({ text = '正在加载' }) {
  return (
    <div styleName="loading">
      <img src={loadingSVG} styleName="loading__img"/>
      <p styleName="loading__text">{text}</p>
    </div>
  );
}
