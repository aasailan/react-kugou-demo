/*
 * @Author: qiao 
 * @Date: 2018-11-29 11:07:48 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-04 14:11:24
 * 歌手列表
 */
import Api from '@/api';
import { ISinger } from '@/api/api';
import CardItem from '@/components/CardItem/CardItem';
import { CustomLoader } from '@/components/ContentLoader/ContentLoader';
import { IRouteState as ISingerInfoRouteState } from '@/page/SingerInfo/SingerInfo';
import { ISetHeaderAction, setHeader } from '@/redux/actions/header';
import { IHeaderState } from '@/redux/reducers/header';
import Axios from 'axios';
import { LocationDescriptorObject } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { IPageComponentProps, pageWrapperGenerator } from '..';
import './singerList.scss';


export interface IRouteState {
  title: string;
}

export interface IRouteParams {
  typeId: string;
}

interface IProps extends ReturnType<typeof mapDispatchToProps>, 
  IPageComponentProps<IData, IRouteParams, any, IRouteState> {
}

interface IData {
  singers: ISinger[];
}

class SingerList extends React.PureComponent<IProps> {

  private source = Axios.CancelToken.source();

  componentDidMount() {
    this.setData();
  }

  async setData() {
    const { setHeader, location: { state: { title }}, 
      match: { params: { typeId } }, updateData, updateError } = this.props;
    try {
      
      setHeader({
        isShow: true,
        title,
        bg: 'rgb(44, 162, 249)'
      });

      const { data: { singers: { list : { info } } } } = await Api.getSingerList({ singerType: typeId }, this.source.token);
      updateData({
        singers: info
      });
    } catch (e) {
      updateError(e);
    } 
  }

  componentWillUnmount() {
    this.source.cancel('cancel by unmount');
  }

  render() {

    const { data, children } = this.props;
    if (!data) {
      return children;
    }

    const { singers } = data;
    return (
      <div className="page">
        <div styleName="singer-list">
          {
            singers.map(singer => (
              <Link to={
                {
                  pathname: `/singer/info/${singer.singerid}`,
                  state: { title: singer.singername }
                } as LocationDescriptorObject<ISingerInfoRouteState>
              } key={singer.singerid}>
                <CardItem key={singer.singerid} 
                  imgUrl={singer.imgurl.replace('{size}', '400')} 
                  name={singer.singername}
                />
              </Link>
            ))
          }
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<ISetHeaderAction>) {
  return {
    setHeader(payload: IHeaderState) {
      dispatch(setHeader(payload));
    }
  }
}

export const SingerListPage = pageWrapperGenerator(connect(null, mapDispatchToProps)(SingerList), CustomLoader);
