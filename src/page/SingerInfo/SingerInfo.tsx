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
import { Dispatch } from 'redux';
import { IPageComponentProps, pageWrapperGenerator } from '..';
import './singerInfo.scss';

export interface IRouteState {
  title: string;
}

interface IRouteParams {
  singerId: string;
}

interface IData {
  bg: string;
  bgdesc: string;
  songs: ISong[];
}

// interface IProps extends ReturnType<typeof mapDispatchToProps>, 
//   RouteComponentProps<IRouteParams, any, IRouteState> {
// }
interface IProps extends ReturnType<typeof mapDispatchToProps>, 
  IPageComponentProps<IData, IRouteParams, any, IRouteState> {}

class SingerInfo extends React.PureComponent<IProps> {

  // state: IState = {
  //   bg: null,
  //   bgdesc: null,
  //   songs: null
  // };
  
  private source = Axios.CancelToken.source();

  componentDidMount() {
    this.setData();
  }

  async setData() {
    const { match: { params: { singerId } }, setHeader, location: { state }, updateData, updateError } = this.props;
    try {
      setHeader({
        isShow: true,
        title: state.title,
        bg: 'rgba(43, 162, 251, 0)'
      });

      const { data: { 
        info: { imgurl, intro }, 
        songs: { list }
      }} = await Api.getSingerInfo({ singerId }, this.source.token);
      const bg = imgurl.replace('{size}', '400');
      const bgdesc = intro;
      const songs = list;
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

    const { songs, bg, bgdesc } = data;

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

export const SingerInfoPage = pageWrapperGenerator(connect(null, mapDispatchToProps)(SingerInfo), CustomLoader) ;
