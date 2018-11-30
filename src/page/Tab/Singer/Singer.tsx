/*
 * @Author: qiao 
 * @Date: 2018-11-25 10:42:02 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-29 17:14:46
 * 歌手
 */
import arrowIconPng from '@/assets/imgs/arrow_icon.png';
import { IRouteState as ISingerListRouteState } from '@/page/SingerList/SingerList';
import { LocationDescriptorObject } from 'history';
import React from 'react';
import { Link } from 'react-router-dom';
import './singer.scss';

const list = [
  [{ txt: '热门歌手', id: 88 }],
  [{ txt: '华语男歌手', id: 1 }, { txt: '华语女歌手', id: 2 }, { txt: '华语组合', id: 3 }],
  [{ txt: '日韩男歌手', id: 4 }, { txt: '日韩女歌手', id: 5 }, { txt: '日韩组合', id: 6 }],
  [{ txt: '欧美男歌手', id: 7 }, { txt: '欧美女歌手', id: 8 }, { txt: '欧美组合', id: 9 }],
];

export function Singer() {
  return (
    <div>
      {
        list.map((group, i) => {
          return (
            <div key={i} styleName="group">
              {
                group.map(item => (
                  <Link key={item.txt} to={
                    {
                      pathname: `/singer/list/${item.id}`,
                      state: { title: item.txt }
                    } as LocationDescriptorObject<ISingerListRouteState>
                  }>
                    <div styleName="group-item">
                      {item.txt}
                      <img src={arrowIconPng} styleName="group-item__right-icon"/>
                    </div>
                  </Link>
                ))
              }
            </div>
          );
        })
      }
    </div>
  );
}
