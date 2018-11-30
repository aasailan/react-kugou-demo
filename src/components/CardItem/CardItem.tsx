/*
 * @Author: qiao 
 * @Date: 2018-11-27 19:29:10 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-28 19:50:24
 * 卡片列表item组件
 */
import morePng from '@/assets/imgs/arrow_icon.png';
import musicPng from '@/assets/imgs/icon_music.png';
import React from 'react';
import './cardItem.scss';

interface IProps {
  imgUrl: string;
  name: string;
  playcount?: number;
}

export default function CardItem({ imgUrl, name, playcount }: IProps) {
  return (
    <div styleName="card-item">
      <img src={imgUrl} styleName="card-item__img"/>
      <img src={morePng} styleName="card-item__more-icon"/>
      <div styleName="card-item__content">
        <div className="one-line-ellipsis" styleName="card-item__title">{name}</div>
        {
          playcount ? ( 
            <div styleName="card-item__play_count">
              <img styleName="card-item__play_count_img" src={musicPng}/>{playcount}
            </div>
          ) : null
        }
      </div>
    </div>
  );
}