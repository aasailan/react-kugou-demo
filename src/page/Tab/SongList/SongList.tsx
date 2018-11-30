/*
 * @Author: qiao 
 * @Date: 2018-11-25 10:40:30 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-28 19:30:16
 * 歌单列表
 */
import Api from '@/api';
import { ISongListItem } from '@/api/api';
import CardItem from '@/components/CardItem/CardItem';
import Loading from '@/components/Loading/Loading';
import { IRouteState as SongListInfoRouteState } from '@/page/SongListInfo/SongListInfo';
import { LocationDescriptorObject } from 'history';
import React from 'react';
import { Link } from 'react-router-dom';
import './songList.scss';

export interface IProps {
  songs: ISongListItem[],
  changeData: (data: { songs: ISongListItem[] }, name: 'songListData') => void;
}

export class SongList extends React.PureComponent<IProps> {

  async componentDidMount() {
    const { songs, changeData } = this.props;
    if (!songs) {
      const { data: { plist: { list: { info }}}} = await Api.getSongs(true);
      changeData({
        songs: info
      }, 'songListData');
    }
  }

  render() {
    const { songs } = this.props;

    if (!songs) {
      return <Loading/>
    }

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
