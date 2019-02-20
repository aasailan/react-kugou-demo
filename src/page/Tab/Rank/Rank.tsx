/*
 * @Author: qiao 
 * @Date: 2018-11-25 10:37:53 
 * @Last Modified by: qiao
 * @Last Modified time: 2019-02-17 15:10:33
 * 排行榜
 */
import Api from '@/api';
import { IRank } from '@/api/api';
import CardItem from '@/components/CardItem/CardItem';
import { IMyPageMethod, IMyPageState, pageWrapperGeneratorByExtends } from '@/page/pageWrapperByExtends';
import { IRouteState as RankInfoRouteState } from '@/page/RankInfo/RankInfo';
import { LocationDescriptorObject } from 'history';
import React from 'react';
import { Link } from 'react-router-dom';
import './rank.scss';

interface IData {
  ranks: IRank[];
}

// 配合代理类HOC 的组件定义
// export class Rank extends React.PureComponent<IPageComponentProps<IData>> {

//   async componentDidMount() {
//     const { data } = this.props;
//     if (!data || !data.ranks) {
//       this.setData();
//     }
//   }

//   async setData() {
//     const { updateData, updateError } = this.props;
//     try {
//       const { data: { rank: { list }}} = await Api.getRanks(true);
//       updateData({
//         ranks: list
//       });
//     } catch (e) {
//       updateError(e);
//     }
//   }

//   render() {

//     const { data, children } = this.props;
//     if (!data || !data.ranks) {
//       return children;
//     }

//     const { ranks } = data;
//     return (
//       <div>
//         {
//           ranks.map(rank => (
//             <Link key={rank.id} to={
//                 { 
//                   pathname: `/rank/info/${rank.rankid}`, 
//                   state: { title: rank.rankname } 
//                 } as LocationDescriptorObject<RankInfoRouteState>
//               }>
//               <CardItem imgUrl={rank.imgurl.replace('{size}', '400')} name={rank.rankname}/>
//             </Link>
//           ))
//         }
//       </div>
//     );
//   }
// }
// export const RankPage = pageWrapperGenerator(Rank);

// 配合使用继承类HOC 组件定义
export class Rank2 extends React.PureComponent<any, IMyPageState<IData>> implements IMyPageMethod {
  
  // 子类需要实现接口，由继承类HOC实现
  updateError;

  async componentDidMount() {
    const { data } = this.state;
    if (!data || !data.ranks) {
      this.setData();
    }
  }

  async setData() {
    try {
      const { data: { rank: { list }}} = await Api.getRanks(true);
      this.setState({
        data: {
          ranks: list,
        }
      });
    } catch (e) {
      this.updateError(e);
    }
  }

  render() {

    const { data } = this.state;
    const { ranks } = data;
    return (
      <div>
        {
          ranks.map(rank => (
            <Link key={rank.id} to={
                { 
                  pathname: `/rank/info/${rank.rankid}`, 
                  state: { title: rank.rankname } 
                } as LocationDescriptorObject<RankInfoRouteState>
              }>
              <CardItem imgUrl={rank.imgurl.replace('{size}', '400')} name={rank.rankname}/>
            </Link>
          ))
        }
      </div>
    );
  }
}
export const RankPage = pageWrapperGeneratorByExtends(Rank2);
