/*
 * @Author: qiao 
 * @Date: 2018-12-09 10:43:14 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-09 10:52:12
 * 错误页面
 */
import networkErrorPng from '@/assets/imgs/network_error.png';
import React from 'react';
import './error.scss';

export interface IProps {
  img?: string;
  title?: string;
  clickHandler?: () => any;
}

export default function ErrorHint({ img = networkErrorPng, 
  title = '点击此重新加载', clickHandler, ...props }: IProps) {
  return (
    <div {...props} styleName="error">
      <img src={img} styleName="error__icon"/>
      <p styleName="error__title" onClick={clickHandler}>{title}</p>
    </div>
  );
}

