/*
 * @Author: qiao 
 * @Date: 2018-11-25 10:37:53 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-27 17:32:18
 * 排行榜
 */
import Api from '@/api';
import CardItem from '@/components/CardItem/CardItem';
import Loading from '@/components/Loading/Loading';
import { IRouteState as RankInfoRouteState } from '@/page/RankInfo/RankInfo';
import { LocationDescriptorObject } from 'history';
import React from 'react';
import { Link } from 'react-router-dom';
import './rank.scss';

interface IRank {
  imgurl: string;
  rankname: string;
  rankid: string;
  id: number;
}

export interface IProps {
  ranks: IRank[];
  changeData: (data: { ranks: IRank[] }, name: 'rankData') => void;
}

export class Rank extends React.PureComponent<IProps> {

  async componentDidMount() {
    const { ranks, changeData } = this.props;
    if (!ranks) {
      const res = await Api.getRanks(true);
      changeData({
        ranks: res.data.rank.list
      }, 'rankData');
    }
  }

  render() {

    const { ranks } = this.props;

    if (!ranks) {
      return <Loading/>
    }

    return (
      <div>
        {
          ranks.map(rank => {
            return (
              <Link key={rank.id} to={
                { 
                  pathname: `/rank/info/${rank.rankid}`, 
                  state: { title: rank.rankname } 
                } as LocationDescriptorObject<RankInfoRouteState>
              }>
                <CardItem imgUrl={rank.imgurl.replace('{size}', '400')} name={rank.rankname}/>
              </Link>
            );
          })
        }
      </div>
    );
  }
}
