/*
 * @Author: qiao 
 * @Date: 2018-11-27 19:29:44 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-28 19:50:36
 * 歌曲item
 */
import { ISong } from '@/api/api';
import downloadPng from '@/assets/imgs/download_icon.png';
import React from 'react';
import './songItem.scss';

interface IProps {
  song: ISong;
  rank?: number;
}

export default function SongItem({ song, rank }: IProps) {
  return (
    <div styleName="song-item">
      { rank !== undefined ? <span styleName="song-item__index">{rank}</span> : null} 
      <img src={downloadPng} styleName="song-item__download-icon"/>
      <div styleName={ rank !== undefined ? 'song-item__title song-item__title--has-rank' 
        : 'song-item__title song-item__title--no-rank'} className="one-line-ellipsis">
        {song.filename}
      </div>
    </div>
  )
}