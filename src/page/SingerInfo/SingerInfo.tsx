/*
 * @Author: qiao 
 * @Date: 2018-11-29 18:34:52 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-04 14:10:25
 * 歌手信息页面
 */
import Api from '@/api';
import { ISong } from '@/api/api';
import { CustomLoader } from '@/components/ContentLoader/ContentLoader';
import SongItem from '@/components/SongItem/SongItem';
import { ISetHeaderAction, setHeader } from '@/redux/actions/header';
import { IHeaderState } from '@/redux/reducers/header';
import Axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Dispatch } from 'redux';
import './singerInfo.scss';

export interface IRouteState {
  title: string;
}

interface IRouteParams {
  singerId: string;
}

interface IState {
  bg: string | null;
  bgdesc: string | null;
  songs: ISong[] | null;
}

interface IProps extends ReturnType<typeof mapDispatchToProps>, 
  RouteComponentProps<IRouteParams, any, IRouteState> {
}

class SingerInfo extends React.PureComponent<IProps, IState> {

  state: IState = {
    bg: null,
    bgdesc: null,
    songs: null
  };
  
  private source = Axios.CancelToken.source();

  async componentDidMount() {
    const { match: { params: { singerId } }, setHeader, location: { state } } = this.props;
    // 需要从路由中获取title参数
    setHeader({
      isShow: true,
      title: state.title,
      bg: 'rgba(43, 162, 251, 0)'
    });

    try {
      const { data: { 
        info: { imgurl, intro }, 
        songs: { list }
      }} = await Api.getSingerInfo({ singerId }, this.source.token);
      console.log('getsingerInfo');
      const bg = imgurl.replace('{size}', '400');
      const bgdesc = intro;
      const songs = list;
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
          <CustomLoader className="page-loader"/>
        </div>
      );
    }

    return (
      <div className="page">
        <div styleName="song-info__bg" style={{ backgroundImage: `url(${bg})`}}/>
        <div styleName="song-info__desc">{ /* TODO: 需要一个上下收缩的动效 */ } {bgdesc}</div>
        <div styleName="div-line"/>
        {
          songs.map((song, index) => (
            <SongItem key={index} song={song}/>
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

export const SingerInfoContainer = connect(null, mapDispatchToProps)(SingerInfo);
