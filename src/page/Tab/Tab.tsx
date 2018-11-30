/*
 * @Author: qiao 
 * @Date: 2018-11-24 19:42:41 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-27 18:37:17
 * 顶部tab组件
 */
// import Api from '@/api';
import { ISetHeaderAction, setHeader } from '@/redux/actions/header';
import { IHeaderState } from '@/redux/reducers/header';
import { IRoute, newSongRoute, rankRoute, routeWithSubRoutes, songListRoute } from '@/router';
import MaterialTab from '@material-ui/core/Tab';
import MaterialTabs from '@material-ui/core/Tabs';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from "react-router-dom";
import { Dispatch } from 'redux';
// import { ITest } from './SongList/SongList';
import { IProps as NewSongProps } from './NewSong/NewSong';
import { IProps as RankProps } from './Rank/Rank';
import { IProps as SongListProps } from './SongList/SongList';
import './tab.scss';

interface IState {
  value: string;
  newSongData: NewSongProps | null;
  rankData: RankProps | null;
  songListData: SongListProps | null;
  [key: string]: any;
}

interface IProps extends RouteComponentProps, ReturnType<typeof mapDispatchToProps> {
  routes: IRoute[];
}

// NOTE: 因为react里面没有keep-alive来保持页面状态。为了保存四个tab内部的数据状态，需要做状态提升。把状态保存在这个组件
// https://github.com/facebook/react/issues/12039
class Tab extends React.Component<IProps, IState> {

  state = {
    value: 'newSong',
    newSongData: null,
    rankData: null,
    songListData: null
  };

  private isMount = false;

  constructor(props: IProps) {
    super(props);
    const { location } = this.props;
    const value = location.pathname.replace('/tab/', '');
    this.state.value = value;
  }

  componentDidMount() {
    this.isMount = true;
    const { setHeader } = this.props;
    setHeader({
      isShow: false
    });
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  onChangeTab = (event: any, value: string) => {
    const { history } = this.props;
    this.setState({
      value
    });
    history.push(`/tab/${value}`, {
      from: 'fromtest'
    });
  }

  // 保存状态
  changeData = (data: any, name: any) => {
    // TODO: 需要避免在unmount的组件里面setState
    if (this.isMount) {
      this.setState({
        [name]: data
      });
    }
  }

  render() {
    const { value, newSongData, rankData, songListData } = this.state;
    const { routes } = this.props;
    console.log('Tab render');
    return (
      <div className="page">
        <MaterialTabs value={value} fullWidth={true} textColor="primary" indicatorColor="primary"
          onChange={this.onChangeTab}>
          <MaterialTab value="newSong" label="新歌"/>
          <MaterialTab value="rank" label="排行"/>
          <MaterialTab value="songList" label="歌单"/>
          <MaterialTab value="singer" label="歌手"/>
        </MaterialTabs>
        <div styleName="tab-container">
          { 
            routes.map((route, i) => {
              let props: any;
              switch(route.name) {
                case newSongRoute.name:
                  props = newSongData;
                  break;
                case rankRoute.name:
                  props = rankData;
                  break;
                case songListRoute.name:
                  props = songListData;
                  break;
                default:
                  props = null;
              }
              const changeData = this.changeData;
              return routeWithSubRoutes(route, i, {
                ...props,
                changeData
              })
            }) 
          }
        </div>
      </div>
    );
  } 
}

function mapDispatchToProps(dispatch: Dispatch<ISetHeaderAction>) {
  return {
    setHeader(payload: IHeaderState) {
      dispatch(setHeader(payload))
    }
  }
}

// 向tab组件注入history对象
export const RouteTab = withRouter(connect(null, mapDispatchToProps)(Tab));
