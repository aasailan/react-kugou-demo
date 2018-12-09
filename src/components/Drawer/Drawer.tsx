/*
 * @Author: qiao 
 * @Date: 2018-12-09 18:57:15 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-09 19:27:23
 * 文字介绍组件
 */
import openIconPng from '@/assets/imgs/open_icon.png';
import React from 'react';
import './drawer.scss';

export interface IProps {
  text: string;
}

interface IState {
  open: boolean;
}

export default class Drawer extends React.PureComponent<IProps, IState> {

  state: IState = {
    open: false,
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    const { text } = this.props;
    const { open } = this.state;
    return (
      <div styleName='drawer'>
        <img styleName={open ? 'drawer__icon drawer__icon--open' : 'drawer__icon drawer__icon--close'} src={openIconPng} onClick={this.toggleDrawer}/>
        <div styleName={open ? 'drawer__text drawer__text--open' : 'drawer__text drawer__text--close'}>
          {text}
        </div>
      </div>
    );
  }
}
