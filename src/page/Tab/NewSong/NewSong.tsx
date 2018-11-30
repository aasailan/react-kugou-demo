/*
 * @Author: qiao 
 * @Date: 2018-11-25 09:56:23 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-27 19:45:30
 * 新歌列表
 */
import Api from '@/api';
// import downloadPng from '@/assets/imgs/download_icon.png';
import Loading from '@/components/Loading/Loading';
import SongItem from '@/components/SongItem/SongItem';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import './newSong.scss';

interface IBanner {
  imgurl: string;
  title: string;
  extra: {
    tourl: string;
  }
}

interface ISong {
  filename: string;
  hash: string;
}

export interface IProps extends RouteComponentProps{
  banners: IBanner[];
  songs: ISong[];
  changeData: (data: { banners: IBanner[], songs: ISong[] }, name: 'newSongData') => void;
}

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export class NewSong extends React.PureComponent<IProps> {

  async componentDidMount() {
    const { banners, songs, changeData } = this.props;
    if (!banners || !songs) {
      const res = await Api.getNewSong(true);
      changeData({
        banners: res.data.banner,
        songs: res.data.data
      }, 'newSongData');
    }
  }

  // componentWillUnmount() {
  //   console.log('componentWillUnmount');
  // }

  render() {
    const { banners, songs } = this.props;

    if (!banners || !songs) {
      return <Loading/>;
    }

    return (
      <div>
        <AutoPlaySwipeableViews interval={3000}>
          {
            banners.map((banner) => {
              return (
                <div key={banner.imgurl}>
                  <a href={banner.extra.tourl}>
                    <img src={banner.imgurl} alt={banner.title}/>
                  </a>
                </div>
              );
            })
          }
        </AutoPlaySwipeableViews>
        {
          songs.map(song => {
            return (
              <SongItem song={song} key={song.hash}/>
              // <div key={song.filename} styleName="song-item" className="one-line-ellipsis">
              //   {song.filename}
              //   <img src={downloadPng} styleName="song-item__download-img"/>
              // </div>
            );
          })
        }
      </div>
    );
  }
}