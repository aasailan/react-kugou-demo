/*
 * @Author: qiao 
 * @Date: 2018-12-04 14:19:37 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-06 20:25:22
 * 网络错误，点击重新加载。没有缓存数据又遭遇网络错误时，需要显示网络错误页面，
 * 提供点击重新加载
 */
import networkErrorPng from '@/assets/imgs/network_error.png';
import React from 'react';
import './networkError.scss';

export interface IProps {
  img?: string;
  title?: string;
  clickHandler?: () => any;
}

export default function NetWorkErrorHint({ img = networkErrorPng, 
  title = '点击此重新加载', clickHandler, ...props }: IProps) {
  return (
    <div {...props} styleName="network-error">
      <img src={img} styleName="network-error__icon"/>
      <p styleName="network-error__title" onClick={clickHandler}>{title}</p>
    </div>
  );
}


