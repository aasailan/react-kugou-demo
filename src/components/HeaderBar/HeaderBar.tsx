/*
 * @Author: qiao 
 * @Date: 2018-11-25 21:21:23 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-11 19:28:59
 */
import goBackPng from '@/assets/imgs/goback_icon.png';
import { IHeaderState } from '@/redux/reducers/header';
import { IStoreState } from '@/redux/store';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import './headerBar.scss';

interface IProps { // extends RouteComponentProps {
  header: IHeaderState;
  classes?: string;
  onClick?: () => void;
}

// history.goBack
// TODO: 针对点击事件进入prop传入设置
export function HeaderBar({ header, onClick, classes = '' }: IProps) {
  if (!header.isShow) {
    return null;
  }
  return (
    <div styleName="header-bar" className={`one-line-ellipsis ${classes}`}
      style={{ background: header.bg }}>
      <img src={goBackPng} styleName="header-bar__back-icon" 
        onClick={onClick}/>
      {header.title}
    </div>
  );
}

function mapStateToProps(state: IStoreState) {
  const { header } = state;
  return {
    header
  };
}

interface IRouteHeaderProps extends RouteComponentProps {
  header: IHeaderState;
}

function RouteHeaderBar({ history, header }: IRouteHeaderProps) {
  return <HeaderBar header={header} onClick={() => history.goBack()}/>
}

const HeaderBarContainer = connect(mapStateToProps)(withRouter(RouteHeaderBar));
export default HeaderBarContainer;