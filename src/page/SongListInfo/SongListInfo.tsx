/*
 * @Author: qiao 
 * @Date: 2018-11-27 18:46:50 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-04 14:12:00
 * 歌单详情页
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
import { Dispatch } from 'redux';
import { IPageComponentProps, pageWrapperGenerator } from '..';
import './songListInfo.scss';

// 需要路由传入的state
export interface IRouteState {
  title: string;
}

interface IRouteParams {
  id: string;
}

interface IData {
  bg: string;
  bgdesc: string;
  songs: ISong[];
}

interface IProps extends ReturnType<typeof mapDispatchToProps>, 
  IPageComponentProps<IData, IRouteParams, any, IRouteState> {
}

class SongListInfo extends React.PureComponent<IProps> {
  
  private source = Axios.CancelToken.source();

  componentDidMount() {
    this.setData();  
  }

  async setData() {
    const { match: { params }, setHeader, location: { state }, updateData, updateError } = this.props;
    // 需要从路由中获取title参数
    setHeader({
      isShow: true,
      title: state.title,
      bg: 'rgba(43, 162, 251, 0)'
    });

    try {
      const { data: { list: { list: { info: songs }}, info: { list: { imgurl, intro: bgdesc } } } } = await Api.getSongListInfo({ infoId: params.id }, this.source.token);
      const bg = imgurl.replace('{size}', '400');
      updateData({
        bg,
        bgdesc,
        songs
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

    const { bg, bgdesc, songs } = data;
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

export const SongListInfoPage = pageWrapperGenerator(connect(null, mapDispatchToProps)(SongListInfo), CustomLoader);
