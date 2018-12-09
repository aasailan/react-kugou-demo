/*
 * @Author: qiao 
 * @Date: 2018-11-25 10:40:30 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-07 15:55:16
 * 歌单列表
 */
import Api from '@/api';
import { ISongListItem } from '@/api/api';
import CardItem from '@/components/CardItem/CardItem';
import { IPageComponentProps, pageWrapperGenerator } from '@/page';
import { IRouteState as SongListInfoRouteState } from '@/page/SongListInfo/SongListInfo';
import { LocationDescriptorObject } from 'history';
import React from 'react';
import { Link } from 'react-router-dom';
import './songList.scss';

interface IData {
  songs: ISongListItem[];
}

export class SongList extends React.PureComponent<IPageComponentProps<IData>> {

  async componentDidMount() {
    const { data } = this.props;
    if (!data || !data.songs) {
      this.setData();
    }
  }

  async setData() {
    const { updateData, updateError } = this.props;
    try {
      const { data: { plist: { list: { info }}}} = await Api.getSongs(true);
      updateData({
        songs: info
      })
    } catch (e) {
      updateError(e);
    }
  }

  render() {
    const { data, children } = this.props;
    if (!data || !data.songs) {
      return children;
    }

    const { songs } = data;
    return (
      <div>
        {
          songs.map((song, index) => (
              // NOTE: 无法在酷狗返回的接口列表中找到一个unqiue value，暂时用index代替
              <Link key={index} to={
                { 
                  pathname: `/plist/info/${song.specialid}`, 
                  state: { title: song.specialname }
                } as LocationDescriptorObject<SongListInfoRouteState>
              }>
                <CardItem imgUrl={song.imgurl.replace('{size}', '400')} 
                  name={song.specialname} playcount={song.playcount}/>
              </Link>
            )
          )
        }
      </div>
    );
  }
}

export const SongListPage = pageWrapperGenerator(SongList);
