/*
 * @Author: qiao 
 * @Date: 2018-11-27 18:46:50 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-28 19:34:37
 * 歌单详情页
 */
import Api from '@/api';
import { ISong } from '@/api/api';
import Loading from '@/components/Loading/Loading';
import SongItem from '@/components/SongItem/SongItem';
import { ISetHeaderAction, setHeader } from '@/redux/actions/header';
import { IHeaderState } from '@/redux/reducers/header';
import Axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Dispatch } from 'redux';
import './songListInfo.scss';

// 需要路由传入的state
export interface IRouteState {
  title: string;
}

interface IRouteParams {
  id: string;
}

// interface ISong {
//   filename: string;
//   hash: string;
// }

interface IState {
  bg: string | null;
  bgdesc: string | null;
  songs: ISong[] | null;
}

interface IProps extends ReturnType<typeof mapDispatchToProps>, 
  RouteComponentProps<IRouteParams, any, IRouteState> {
}

class SongListInfo extends React.PureComponent<IProps, IState> {

  state: IState = {
    bg: null,
    bgdesc: null,
    songs: null
  };
  
  private source = Axios.CancelToken.source();

  async componentDidMount() {
    const { match: { params }, setHeader, location: { state } } = this.props;
    // 需要从路由中获取title参数
    setHeader({
      isShow: true,
      title: state.title,
      bg: 'rgba(43, 162, 251, 0)'
    });

    try {
      const { data } = await Api.getSongListInfo({ infoId: params.id }, this.source.token);
      const bg = data.info.list.imgurl.replace('{size}', '400');
      const bgdesc = data.info.list.intro;
      const songs = data.list.list.info;
      this.setState({
        bg,
        bgdesc,
        songs
      });
    } catch (e) {
      console.error(e.message || e);
    }
  }

  componentWillUnmount() {
    this.source.cancel('cancel by unmount');
  }
  
  render() {

    const { bg, songs, bgdesc} = this.state;
    if (!bg || !songs || !bgdesc) {
      return (
        <div className="page">
          <Loading/>
        </div>
      );
    }

    return (
      <div className="page">
        <div styleName="song-info__bg" style={{ backgroundImage: `url(${bg})`}}/>
        <div styleName="song-info__desc">{ /* TODO: 需要一个上下收缩的动效 */ } {bgdesc}</div>
        <div styleName="div-line"/>
        {
          songs.map(song => (
            <SongItem key={song.hash} song={song}/>
          ))
        }
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

export const SongListInfoContainer = connect(null, mapDispatchToProps)(SongListInfo);
