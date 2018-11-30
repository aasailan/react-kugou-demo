/*
 * @Author: qiao 
 * @Date: 2018-11-25 21:17:38 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-28 19:00:56
 * 排行榜详情
 */
import Api from '@/api';
import { ISong } from '@/api/api';
import Loading from '@/components/Loading/Loading';
import SongItem from '@/components/SongItem/SongItem';
import { ISetHeaderAction, setHeader } from '@/redux/actions/header';
import { IHeaderState } from '@/redux/reducers/header';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Dispatch } from 'redux';
import './rankInfo.scss';

// TODO: 需要做监听滚动，headerbar逐渐变得不透明的动效

// 需要路由传入的state
export interface IRouteState {
  title: string;
}

interface IProps extends ReturnType<typeof mapDispatchToProps>, 
  RouteComponentProps<any, any, IRouteState> {

}

interface IState {
  bg: string | null;
  updateTime: string | null;
  songs: ISong[] | null;
}

class RankInfo extends React.PureComponent<IProps, IState> {

  // private isMount = false;
  state: IState = {
    bg: null,
    updateTime: null,
    songs: null
  };

   // TODO: 需要验证 是否可以复用？
   private source = axios.CancelToken.source();

  // changeHeaderBar = () => {
  //   const { setHeader } = this.props;
  //   setHeader({
  //     title: '酷狗飙升榜',
  //     bg: 'rgba(43, 162, 251, 1)'
  //   });
  // }

  async componentDidMount() {
    // this.isMount = true;
    const { match: { params }, setHeader, location: { state } } = this.props;
    // 需要从路由中获取title参数
    setHeader({
      isShow: true,
      title: state.title,
      bg: 'rgba(43, 162, 251, 0)'
    });
    
    try {
      const { data: { info: { banner7url }, songs: { list }} } = await Api.getRankInfo({ rankid: params.id }, this.source.token);
      const bg = banner7url.replace('{size}', '400');
      const songs = list;
      const updateTime = this.getToday(new Date());
      this.setState({
        bg,
        songs,
        updateTime 
      });
    } catch (e) {
      console.error(e.message || e);
    }
  }

  getToday(time: Date){
    // const time = new Date()
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
    // this.isMount = false;
    this.source.cancel('cancel by unmount');
  }

  render() {
    const { bg, songs, updateTime } = this.state;
    if (!bg || !songs) {
      return (
        <div className="page">
          <Loading/>
        </div>
      );
    }

    return (
      <div className="page">
        <div styleName="rank-bg" style={{ backgroundImage: `url(${bg})`  }}>
          <div styleName="rank-bg__title">上次更新时间：{updateTime}</div>
        </div>
        <div styleName="song-list">
          {
            songs.map((song, i) => {
              return (
                <SongItem song={song} key={song.hash} rank={i}/>
              )
            })  
          }
        </div>
      </div>
    );
  }
}

// function mapStateToProps(state: IStoreState) {

// }

function mapDispatchToProps(dispatch: Dispatch<ISetHeaderAction>) {
  return {
    setHeader(payload: IHeaderState) {
      dispatch(setHeader(payload));
    }
  }
}

export const RankInfoContainer = connect(null, mapDispatchToProps)(RankInfo);
