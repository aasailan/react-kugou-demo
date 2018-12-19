/*
 * @Author: qiao 
 * @Date: 2018-12-10 09:38:16 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-13 19:16:33
 * 播放组件
 */
import { ISetAudioAction, ISetPlayerAction, nextSong, setAudio, setPlayer } from '@/redux/actions';
import { IAudioState } from '@/redux/reducers/audio';
import { IPlayerState } from '@/redux/reducers/player';
import { IStoreState } from '@/redux/store';
import Axios, { CancelToken } from 'axios';
import getClassName from 'babel-plugin-react-css-modules/dist/browser/getClassName';
import React, { MouseEventHandler, ReactEventHandler, RefObject } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import './player.scss';

const cssPrefix = 'player__';
const styleModuleImportMap = {
  // NOTE: scss的默认编译导出就是locals
  locals: {
    'player__toggle-icon': `${cssPrefix}player__toggle-icon`,
    'player__toggle-icon--loading': `${cssPrefix}player__toggle-icon--loading`,
    'player__toggle-icon--open': `${cssPrefix}player__toggle-icon--open`,
    'player__toggle-icon--close': `${cssPrefix}player__toggle-icon--close`
  }
};

interface IProps extends ReturnType<typeof mapStateToProps>, 
  ReturnType<typeof mapDispatchToProps> {}

interface IState {
  open: boolean;
  // NOTE: 之后从redux获取
  // loading: boolean;
  // 是否暂停
  // pause: boolean;
}

class Player extends React.PureComponent<IProps, IState> {

  state: IState = {
    open: true
  }

  timer: number | null = null;

  audioRef: RefObject<HTMLAudioElement> = React.createRef();

  source = Axios.CancelToken.source();

  toggleClass() {
    const { player: { loading } } = this.props;
    const { open } = this.state;

    let classNames = 'player__toggle-icon';
    if (loading) {
      classNames += ' player__toggle-icon--loading';
    } else {
      if (open) {
        classNames += ' player__toggle-icon--open';
      } else {
        classNames += ' player__toggle-icon--close';
      }
    }
    return classNames;
  }

  toggleOpen = () => {
    this.setState({
      open: !this.state.open
    })
  }

  togglePlay: MouseEventHandler = (event) => {
    event.stopPropagation();
    const { onSetPlayer, player: { pause } } = this.props;
    onSetPlayer({
      pause: !pause
    });
  }

  // NOTE: 如何在pause变化的时候得出响应，处理业务 
  // 有空了解下 redux-observable
  componentDidUpdate() {
    const { player: { pause }, audio: { songUrl } } = this.props;
    const audio: HTMLAudioElement | null = this.audioRef.current;
    // 判断songUrl确定有正在播放的歌曲
    if (audio && songUrl) {
      if (pause) {
        audio.play && audio.pause();
      } else {
        audio.pause && audio.play();
      }
    }
  }

  showDetailPlayer: MouseEventHandler = () => {
    const { onSetPlayer, audio: { songUrl } } = this.props;
    if (!songUrl) {
      return;
    }
    onSetPlayer({
      showDetailPlayer: true
    });
  }

  nextSong = (event) => {

    event.stopPropagation();
    const { onNextSong, player: { loading } } = this.props;
    if (loading && this.source) {
      // 如果正在加载，则取消加载请求
      this.source.cancel('next song');
      this.source = Axios.CancelToken.source();
    }
    onNextSong(this.source.token);
  }

  // TODO: 如果被拖拽后需要调整播放拖拽后的进度
  timeUpdate: ReactEventHandler = (event) => {
    // console.log(event);
    const audio = event.currentTarget as HTMLAudioElement;
    if (!this.timer) {
      this.timer = requestAnimationFrame(() => {
        const { currentTime } = audio;
        const { onSetAudio, audio: { changeProgress, currentLength } } = this.props;
        if (changeProgress) {
          // 被拖动了进度条
          onSetAudio({
            changeProgress: false
          });
          audio.currentTime = currentLength as number;
        } else {
          console.log(currentTime);
          onSetAudio({
            currentLength: currentTime
          });
        }
        this.timer = null;
      });
    }
  }

  render() {
    const { open } = this.state;
    const { player: { pause }, audio: { imgUrl, title, singer, songUrl } } = this.props;

    return (
      <div styleName={ open ? 'player player--open' : 'player player--close'}>
        {/* NOTE: 在runtime的时候决定css https://github.com/gajus/babel-plugin-react-css-modules#runtime-stylename-resolution */}
        <div onClick={this.toggleOpen} className={getClassName(this.toggleClass(), styleModuleImportMap)}/>
        <div styleName="player__box" onClick={this.showDetailPlayer}>
          <img styleName="player__box-img" src={imgUrl}/>
          <span styleName="player__box-next" onClick={this.nextSong}/>
          <span styleName={!pause ? 'player__box-pause' : 'player__box-play'} onClick={this.togglePlay}/>
          <div styleName="player__box-info">
            <p styleName="player__box-info-title" className="one-line-ellipsis">{title}</p>
            <p styleName="player__box-info-singer" className="one-line-ellipsis">{singer}</p>
          </div>
        </div>
        <audio ref={this.audioRef} id='player__audio' src={songUrl} autoPlay={true} onTimeUpdate={this.timeUpdate}
          onEnded={this.nextSong} onError={this.nextSong}/>
      </div>
    );
  }
}

function mapStateToProps(state: IStoreState) {
  const { player, audio } = state;
  return {
    player,
    audio
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<IStoreState, null, ISetPlayerAction | ISetAudioAction>) {
  return {
    onSetPlayer(payload: IPlayerState) {
      dispatch(setPlayer(payload));
    },
    onSetAudio(payload: IAudioState) {
      dispatch(setAudio(payload));
    },
    onNextSong(token: CancelToken) {
      dispatch(nextSong(token));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
