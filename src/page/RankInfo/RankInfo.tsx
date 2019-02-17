/*
 * @Author: qiao 
 * @Date: 2018-11-25 21:17:38 
 * @Last Modified by: qiao
 * @Last Modified time: 2019-02-17 14:59:13
 * 排行榜详情
 */
import Api from '@/api';
import { ISong } from '@/api/api';
import { CustomLoader } from '@/components/ContentLoader/ContentLoader';
import SongItem from '@/components/SongItem/SongItem';
import { getSong, ISetHeaderAction, setHeader } from '@/redux/actions';
import { IHeaderState } from '@/redux/reducers/header';
import axios, { CancelToken } from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
// import { Dispatch } from 'redux';
import { IPageComponentProps, pageWrapperGenerator } from '..';
import './rankInfo.scss';

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

  private frameId: number | null = null;

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.setData();
    // 取消请求测试
    // this.source.cancel('cancel by unmount');
  }

  async setData() {
    const { match: { params }, onSetHeader, location: { state }, updateData, updateError } = this.props;
    try {  
      onSetHeader({
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
      console.log('catch error');
      updateError(e);
    }
  }

  // 泛型传入currentTarget类型
  setHeaderBarStyle: React.UIEventHandler<HTMLDivElement> = (event) => {
    const target = event.currentTarget;
    if (this.frameId === null) {
      this.frameId = window.requestAnimationFrame(() => {
        // https://javascript.info/size-and-scroll
        // console.log(target.scrollTop);
        const { onSetHeader } = this.props;
        const { scrollTop } = target;
        let opacity;
        if (scrollTop <= 200) {
          opacity = scrollTop / 200;
        } else {
          opacity = 1;
        }
        onSetHeader({
          bg: `rgba(43, 162, 251, ${opacity})`
        });
        this.frameId = null;
      });
    };
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

  playMusic = (song: ISong) => {
    const { onGetSong } = this.props;
    onGetSong(song.hash, this.source.token);
  }

  render() {

    const { data, children } = this.props;
    if (!data) {
      // NOTE: how to pass data to props.children
      // https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children
      // https://frontarm.com/articles/passing-data-props-children/
      // https://react.docschina.org/docs/react-api.html#reactchildren
      const childrenWithProps = React.Children.map(children, child => 
        React.cloneElement(child as any, { className: 'page-loading' })
      );
      return (
        <div className="page">
          {childrenWithProps}
        </div>
      );
    }

    const { songs, bg, updateTime } = data;

    return (
      <div className="page" onScroll={this.setHeaderBarStyle}>
        <div styleName="rank-bg" style={{ backgroundImage: `url(${bg})`  }}>
          <div styleName="rank-bg__title">上次更新时间：{updateTime}</div>
        </div>
        <div styleName="song-list">
          {
            songs.map((song, i) => (
                <SongItem title={song.filename} key={song.hash} rank={i} onClick={this.playMusic.bind(this, song)}/>
            ))  
          }
        </div>
      </div>
    );
  }
}

// NOTE: ThunkDispatch的声明文件貌似对ThunkAction的传入支持不太好
function mapDispatchToProps(dispatch: ThunkDispatch<any, any, ISetHeaderAction>) {
  return {
    onSetHeader(payload: IHeaderState) {
      dispatch(setHeader(payload));
    },
    onGetSong(songHash: string, token: CancelToken) {
      dispatch(getSong(songHash, token))
    }
  };
}

export const RankInfoPage = pageWrapperGenerator(connect(null, mapDispatchToProps)(RankInfo), CustomLoader);
