/*
 * @Author: qiao 
 * @Date: 2018-11-25 09:56:23 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-13 18:39:37
 * 新歌列表
 */
import Api from '@/api';
import { IBanner, ISong } from '@/api/api';
import SongList from '@/components/SongList/SongList';
// import { NetworkError } from '@/api/networkError';
import { IPageComponentProps, pageWrapperGenerator } from '@/page';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import './newSong.scss';

interface IData {
  banners: IBanner[],
  songs: ISong[]
}

export interface IProps extends IPageComponentProps<IData> {
}

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

class NewSong extends React.PureComponent<IProps> {

  async componentDidMount() {
    const { data } = this.props;
    if ( !data || !data.banners || !data.songs) {
      this.setData();
    }
  }

  // 获取数据
  async setData() {
    const { updateError, updateData } = this.props;
    try {
      // 如果需要自定义error提示，则在此进行catch
      const { data: { banner, data } } = await Api.getNewSong(true);
      updateData({
        banners: banner,
        songs: data
      });
      // throw new NetworkError('网络错误测试');
    } catch (e) {
      updateError(e);
    }
  }

  render() {
    console.log(this.constructor.name);
    
    const { data, children } = this.props;

    if (!data) {
      return children;
    }

    const { banners, songs } = data;
    return (
      <div>
        <AutoPlaySwipeableViews interval={3000}>
          {
            banners.map((banner) => (
              <div key={banner.imgurl}>
                <a href={banner.extra.tourl}>
                  <img src={banner.imgurl} alt={banner.title}/>
                </a>
              </div>
            ))
          }
        </AutoPlaySwipeableViews>
        <SongList songs={songs}/>
      </div>
    );
  }
}

export const NewSongPage = pageWrapperGenerator(NewSong);