/*
 * @Author: qiao 
 * @Date: 2018-11-27 18:46:50 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-13 17:35:07
 * 歌单详情页
 */
import Api from '@/api';
import { ISong } from '@/api/api';
import { CustomLoader } from '@/components/ContentLoader/ContentLoader';
import Drawer from '@/components/Drawer/Drawer';
import SongList from '@/components/SongList/SongList';
// import SongItem from '@/components/SongItem/SongItem';
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

  private frameId: number | null = null;

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

  setHeaderBarStyle: React.UIEventHandler<HTMLDivElement> = (event) => {
    const target = event.currentTarget;
    if (this.frameId === null) {
      this.frameId = window.requestAnimationFrame(() => {
        const { setHeader } = this.props;
        const { scrollTop } = target;
        let opacity;
        if (scrollTop <= 200) {
          opacity = scrollTop / 200;
        } else {
          opacity = 1;
        }
        setHeader({
          bg: `rgba(43, 162, 251, ${opacity})`
        });
        this.frameId = null;
      });
    };
  }
  
  render() {
    console.log(this.constructor.name);
    const { data, children } = this.props;
    if (!data) {
      const childrenWithProps = React.Children.map(children, child => 
        React.cloneElement(child as any, { className: 'page-loading' })
      );
      return (
        <div className="page">
          {childrenWithProps}
        </div>
      );
    }

    const { bg, bgdesc, songs } = data;
    return (
      <div className="page" onScroll={this.setHeaderBarStyle}>
        <div styleName="song-info__bg" style={{ backgroundImage: `url(${bg})`}}/>
        <Drawer text={bgdesc}/>
        <div styleName="div-line"/>
        <SongList songs={songs}/>
        {/* {
          songs.map(song => (
            <SongItem key={song.hash} song={song}/>
          ))
        } */}
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
