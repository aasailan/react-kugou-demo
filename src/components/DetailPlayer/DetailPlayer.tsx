/*
 * @Author: qiao 
 * @Date: 2018-12-10 19:18:02 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-12 20:22:29
 * 播放详情页面
 */
import { ISetAudioAction, ISetPlayerAction, nextSong, prevSong, setAudio, setPlayer } from '@/redux/actions';
import audio, { IAudioState } from '@/redux/reducers/audio';
// import { IHeaderState } from '@/redux/reducers/header';
import { IPlayerState } from '@/redux/reducers/player';
import { IStoreState } from '@/redux/store';
import Slider from '@material-ui/lab/Slider';
import Axios, { CancelToken, CancelTokenSource } from 'axios';
import getClassName from 'babel-plugin-react-css-modules/dist/browser/getClassName';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { HeaderBar } from '../HeaderBar/HeaderBar';
import './detailPlayer.scss';

const cssPrefix = 'detailPlayer__';
const styleModuleImportMap = {
  // NOTE: scss的默认编译导出就是locals
  locals: {
    'detail-player__header': `${cssPrefix}detail-player__header`
  }
};

/**
 * @description 切割歌词，根据歌词时间点返回歌词数组
 * @param {string} lrc 酷狗api返回的歌词字符串
 * @returns 歌词数组
 */
function sliceLrc(lrc: string) {
  // 每行一个item
  let temp: any = lrc.split('\r\n')
  temp = temp.splice(0, temp.length - 1)
  const lrcList: ILrcItem[] = temp.map((value)=> {
    // 切割时间 [00:00.04] 舍去毫秒
    const time = value.substr(1, 5) // [00:00]
    // 转换成每行的时间点（s）
    const second = parseInt(time.split(':')[0], 10) * 60 + parseInt(time.split(':')[1], 10)
    // 切割歌词
    const lrcText = value.substr(10)
    return {
      second,
      lrcText
    }
  })
  return lrcList;
}

/**
 * @description 根据当前时刻以及歌词数组计算歌词位移
 * @param {number} currentLength
 * @param {ILrcItem[]} lrcList
 * @returns
 */
function getLrcOffset(currentLength: number, lrcList: ILrcItem[]) {
  const showLrcList = lrcList.filter(lrc => lrc.second < currentLength);
  // 一句歌词21px
  const offset = -(21 * showLrcList.length - 21 * 2);
  return offset;
}

interface IProps extends ReturnType<typeof mapStateToProps>, 
  ReturnType<typeof mapDispatchToProps> {}

interface ILrcItem {
  second: number;
  lrcText: string;
}

interface IState {
  lrcList: ILrcItem[],
  lrcOffset: number;
  lrc: string;
}

class DetailPlayer extends React.PureComponent<IProps, IState> {

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    const { audio: { lrc: nextLrc, currentLength: nextCurrentLength }, player: { showDetailPlayer } } = nextProps;
    const { lrc: prevLrc, lrcOffset: prevLrcOffset, lrcList: prevLrcList } = prevState;

    if (!showDetailPlayer) {
      return null;
    }

    let nextLrcOffset;
    let nextLrcList;
    let nextState: IState | null = null;
    if (nextLrc && nextLrc !== prevLrc) {
      // 更新歌词 获取新的歌词数组
      nextLrcList = sliceLrc(nextLrc);
      nextLrcOffset = getLrcOffset(nextCurrentLength as number, nextLrcList);
    } else {
      nextLrcOffset = getLrcOffset(nextCurrentLength as number, prevLrcList);
    }

    // 更新歌词
    if (nextLrcList) {
      nextState = {
        lrcList: nextLrcList,
        lrc: nextLrc,
        lrcOffset: nextLrcOffset
      } as IState;
    } else {
      // 只更新歌词位移
      if (nextLrcOffset !== prevLrcOffset) {
        nextState = {
          lrcOffset: nextLrcOffset
        } as IState;
      }  else {
        // console.log('啥也不更新', nextState);
      }
    }
    return nextState;
  }

  state: IState = {
    lrcList: [],
    lrcOffset: 0,
    lrc: ''
  };

  timer: null | number = null;
  pause: boolean | undefined = false;

  source: CancelTokenSource = Axios.CancelToken.source();

  // 节流
  changeSongProgress = (event, value) => {
    if (!this.timer) {
      this.timer = requestAnimationFrame(() => {
        console.log(value);
        const { onSetAudio } = this.props;
        onSetAudio({
          currentLength: value
        });
        this.timer = null;
      });
    }
  }

  changeSongProgressStart = () => {
    const { player: { pause } } = this.props;
    this.pause = pause;
    this.pauseMusic(true);
  }

  changeSongProgressEnd = () => {
    const { onSetPlayer, onSetAudio } = this.props;
    // 标记被拖动了进度条
    onSetAudio({
      changeProgress: true
    });
    onSetPlayer({
      pause: this.pause
    });
  }

  pauseMusic = (pause: boolean) => {
    const { onSetPlayer } = this.props;
    onSetPlayer({
      pause
    });
  }

  closeDetailPlay = () => {
    const { onSetPlayer } = this.props;
    onSetPlayer({
      showDetailPlayer: false
    });
  }

  formatTime(second: number) {
    let min: any = Math.floor(second / 60);
    let sec: any = Math.floor(second % 60);
    if (min < 10) {
      min = '0' + min;
    }
    if (sec < 10) {
      sec = '0' + sec;
    }
    return `${min}:${sec}`
  }

  nextSong = () => {
    const { onNextSong, player: { loading } } = this.props;
    if (loading && this.source) {
      // 如果正在加载，则取消加载请求
      this.source.cancel('next song');
      this.source = Axios.CancelToken.source();
    }
    onNextSong(this.source.token);
  }

  prevSong = () => {
    const { onPrevSong, player: { loading } } = this.props;
    if (loading && this.source) {
      // 如果正在加载，则取消加载请求
      this.source.cancel('prev song');
      this.source = Axios.CancelToken.source();
    }
    onPrevSong(this.source.token);
  }

  render() {

    const { 
      player: { showDetailPlayer, pause },
      audio: { currentLength = 0, title, imgUrl, songLength }
     } = this.props;

    if (!audio) {
      return null;
    }

    const { lrcList, lrcOffset } = this.state;

    return (
      <div className='page' 
        styleName={showDetailPlayer ? 'detail-player detail-player--open' : 'detail-player detail-player--close' }>
        <div styleName="detail-player__bg" style={{ backgroundImage: `url(${imgUrl})` }}/>
        <div styleName="detail-player__container">
          <HeaderBar classes={getClassName('detail-player__header', styleModuleImportMap)} 
            header={{ isShow: true, title, bg: 'rgba(0,0,0,0.4)' }} onClick={this.closeDetailPlay}/>
          <img src={imgUrl}
            styleName='detail-player__img'/>
          <div styleName='detail-player__lrc-window'>
            <div styleName='detail-player__lrc-box' style={{ transform: `translateY(${lrcOffset}px)` }}>
              {
                lrcList.map((item, index) => (
                  <p key={item.second + index + item.lrcText}>{item.lrcText}</p>
                ))
              }
            </div>
          </div>
          <div styleName="progress">
            <span styleName="progress__time progress__time--start">{this.formatTime(currentLength as number)}</span>
            <span styleName="progress__time progress__time--end">{this.formatTime(songLength as number)}</span>
            {/*  */}
            <Slider
              styleName="progress__slider"
              value={currentLength}
              aria-labelledby="label"
              max={songLength}
              onChange={this.changeSongProgress}
              onDragStart={this.changeSongProgressStart}
              onDragEnd={this.changeSongProgressEnd}
            />
          </div>
          <div styleName="play-controll">
            <span styleName="play-controll__pre-song" onClick={this.prevSong}/>
            <span styleName={ !pause ? "play-controll__pause": "play-controll__play"} 
              onClick={() => this.pauseMusic(!pause)}/>
            <span styleName="play-controll__next-song" onClick={this.nextSong}/>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: IStoreState) {
  const { player, audio } = state;
  return {
    player,
    audio
  }
}

function mapDispatchToProps(dispatch: ThunkDispatch<IStoreState, any, ISetPlayerAction | ISetAudioAction>) {
  return {
    onSetPlayer(payload: IPlayerState) {
      dispatch(setPlayer(payload));
    },
    onSetAudio(payload: IAudioState) {
      dispatch(setAudio(payload));
    },
    onNextSong(token: CancelToken) {
      dispatch(nextSong(token));
    },
    onPrevSong(token: CancelToken) {
      dispatch(prevSong(token));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailPlayer);
