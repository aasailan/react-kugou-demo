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
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import './singerList.scss';


export interface IRouteState {
  title: string;
}

export interface IRouteParams {
  typeId: string;
}


interface IProps extends ReturnType<typeof mapDispatchToProps>, 
  RouteComponentProps<IRouteParams, any, IRouteState> {
}

interface IState {
  singers: ISinger[] | null;
}

class SingerList extends React.PureComponent<IProps, IState> {

  state: IState = {
    singers: null
  }

  private source = Axios.CancelToken.source();

  async componentDidMount() {
    try {
      const { setHeader, location: { state: { title }}, 
      match: { params: { typeId } } } = this.props;
      setHeader({
        isShow: true,
        title,
        bg: 'rgb(44, 162, 249)'
      });

    const { data: { singers: { list : { info } } } } = await Api.getSingerList({ singerType: typeId }, this.source.token);
    this.setState({
      singers: info
    });
  } catch (e) {
      console.error(e.message || e);
    } 
  }

  componentWillUnmount() {
    this.source.cancel('cancel by unmount');
  }

  render() {

    const { singers } = this.state;
    if (!singers) {
      return (
        <div className="page">
          <CustomLoader className="page-loader"/>
        </div>
      );
    }

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
              }>
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

export const SingerListContainer = connect(null, mapDispatchToProps)(SingerList);
