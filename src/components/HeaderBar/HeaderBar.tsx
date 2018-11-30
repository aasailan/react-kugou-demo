/*
 * @Author: qiao 
 * @Date: 2018-11-25 21:21:23 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-27 18:41:21
 */
import goBackPng from '@/assets/imgs/goback_icon.png';
import { IHeaderState } from '@/redux/reducers/header';
import { IStoreState } from '@/redux/store';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import './headerBar.scss';

interface IProps extends RouteComponentProps {
  header: IHeaderState;
}

function HeaderBar({ header, history }: IProps ) {

  if (!header.isShow) {
    return null;
  }

  return (
    <div styleName="header-bar" className="one-line-ellipsis"
      style={{ background: header.bg }}>
      <img src={goBackPng} styleName="header-bar__back-icon" onClick={history.goBack}/>
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

export default connect(mapStateToProps)(withRouter(HeaderBar));