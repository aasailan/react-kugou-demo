/*
 * @Author: qiao 
 * @Date: 2018-11-25 21:17:38 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-09 11:06:11
 * 排行榜详情
 */
import Api from '@/api';
import { ISong } from '@/api/api';
import { CustomLoader } from '@/components/ContentLoader/ContentLoader';
// import { CustomLoader } from '@/components/ContentLoader/ContentLoader';
import SongItem from '@/components/SongItem/SongItem';
import { ISetHeaderAction, setHeader } from '@/redux/actions/header';
import { IHeaderState } from '@/redux/reducers/header';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IPageComponentProps, pageWrapperGenerator } from '..';
import './rankInfo.scss';

// TODO: 需要做监听滚动，headerbar逐渐变得不透明的动效

// 需要路由传入的state
export interface IRouteState {
  title: string;
}

// NOTE: 路由参数的value都会变成string，就算传入的时候是数字
export interface IRouteParams {
  id: string;
}

interface IData {
  bg: string;
  updateTime: string;
  songs: ISong[];
}

interface IProps extends ReturnType<typeof mapDispatchToProps>, 
  IPageComponentProps<IData, IRouteParams, any, IRouteState> {
}

class RankInfo extends React.PureComponent<IProps> {

   private source = axios.CancelToken.source();

  constructor(props: IProps) {
    super(props);
  }

  async componentDidMount() {
    this.setData();
  }

  async setData() {
    const { match: { params }, setHeader, location: { state }, updateData, updateError } = this.props;
    try {  
      setHeader({
        isShow: true,
        title: state.title,
        bg: 'rgba(43, 162, 251, 0)'
      });
      const { data: { info: { banner7url }, songs: { list }} } = await Api.getRankInfo({ rankid: params.id as any }, this.source.token);
      const bg = banner7url.replace('{size}', '400');
      const updateTime = this.getToday(new Date());
      // throw new Error('test');
      updateData({
        songs: list,
        bg,
        updateTime
      });
    } catch (e) {
      updateError(e);
    }
  }

  getToday(time: Date){
    const year = time.getFullYear()
    let month: number | string = time.getMonth() + 1
    let date: number | string = time.getDate()
    if(month < 10) {
      month = '0' + month
    }
    if(date < 10) {
      date = '0' + date
    }
    return `${year}-${month}-${date}`
  }

  componentWillUnmount() {
    this.source.cancel('cancel by unmount');
  }

  render() {

    const { data, children } = this.props;
    if (!data) {
      return children;
    }

    const { songs, bg, updateTime } = data;

    return (
      <div className="page">
        <div styleName="rank-bg" style={{ backgroundImage: `url(${bg})`  }}>
          <div styleName="rank-bg__title">上次更新时间：{updateTime}</div>
        </div>
        <div styleName="song-list">
          {
            songs.map((song, i) => (
                <SongItem song={song} key={song.hash} rank={i}/>
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

export const RankInfoPage = pageWrapperGenerator(connect(null, mapDispatchToProps)(RankInfo), CustomLoader);
