/*
 * @Author: qiao 
 * @Date: 2018-11-27 19:29:44 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-17 19:45:34
 * 歌曲item
 */
// import { ISong } from '@/api/api';
import downloadPng from '@/assets/imgs/download_icon.png';
import React, { MouseEventHandler } from 'react';
import './songItem.scss';

interface IProps {
  // song: ISong;
  title: string;
  rank?: number;
  onClick?: MouseEventHandler
  showDownload?: boolean
  // [key: string]: any;
}

export default function SongItem({ title, rank, onClick, showDownload = true }: IProps) {
  return (
    <div styleName="song-item" onClick={onClick}>
      { rank !== undefined ? <span styleName="song-item__index">{rank}</span> : null} 
      { showDownload && <img src={downloadPng} styleName="song-item__download-icon"/> }
      <div styleName={ rank !== undefined ? 'song-item__title song-item__title--has-rank' 
        : 'song-item__title song-item__title--no-rank'} className="one-line-ellipsis">
        {title}
      </div>
    </div>
  )
}