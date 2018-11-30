/*
 * @Author: qiao 
 * @Date: 2018-11-24 18:59:00 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-26 18:25:42
 * 头部组件
 */
import React from 'react';

import { Link } from 'react-router-dom';
import './header.scss';

export default function Header() {
  return (
    <div styleName="header">
      <Link to="/">
        <img styleName="header__logo" src="http://m.kugou.com/v3/static/images/index/logo.png"/>
      </Link>
      <Link to="/tab/search">
        <img styleName="header__search" src="http://m.kugou.com/v3/static/images/index/search.png"/>
      </Link>
    </div>
  );
}
