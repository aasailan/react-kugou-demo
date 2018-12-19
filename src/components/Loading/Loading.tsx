/*
 * @Author: qiao 
 * @Date: 2018-11-25 15:21:47 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-06 19:18:01
 * 加载组件
 */
import loadingSVG from '@/assets/imgs/loading.svg';
import React from 'react';
import './loading.scss';

interface IProps {
  text?: string;
}

export default function Loading({ text = '正在加载' }: IProps) {
  return (
    <div styleName="loading">
      <img src={loadingSVG} styleName="loading__img"/>
      <p styleName="loading__text">{text}</p>
    </div>
  );
}
