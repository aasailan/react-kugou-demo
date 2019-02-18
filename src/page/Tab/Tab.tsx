/*
 * @Author: qiao 
 * @Date: 2018-11-24 19:42:41 
 * @Last Modified by: qiao
 * @Last Modified time: 2019-02-18 17:39:48
 * 顶部tab组件
 */
// import Api from '@/api';
import { ISetHeaderAction, setHeader } from '@/redux/actions/header';
import { IHeaderState } from '@/redux/reducers/header';
import { createRouteWithHook, IRoute } from '@/router';
import MaterialTab from '@material-ui/core/Tab';
import MaterialTabs from '@material-ui/core/Tabs';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from "react-router-dom";
import { Dispatch } from 'redux';
import './tab.scss';

interface IState {
  value: string;
}

interface IProps extends RouteComponentProps, ReturnType<typeof mapDispatchToProps> {
  routes: IRoute[];
}

// NOTE: 因为react里面没有keep-alive来保持页面状态。 https://github.com/facebook/react/issues/12039
// 只维护tab状态，以及设置title
class Tab extends React.PureComponent<IProps, IState> {

  state: IState = {
    value: 'newsong',
  };

  constructor(props: IProps) {
    super(props);
    const { location } = this.props;
    const value = location.pathname.replace('/tab/', '');
    // debugger;
    this.state.value = value;
  }

  componentDidMount() {
    const { setHeader } = this.props;
    setHeader({
      isShow: false
    });
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

  render() {
    const { value } = this.state;
    const { routes } = this.props;
    console.log('Tab render');
    return (
      <div className="page">
        <MaterialTabs value={value} fullWidth={true} textColor="primary" indicatorColor="primary"
          onChange={this.onChangeTab}>
          <MaterialTab value="newsong" label="新歌"/>
          <MaterialTab value="rank" label="排行"/>
          <MaterialTab value="songlist" label="歌单"/>
          <MaterialTab value="singer" label="歌手"/>
        </MaterialTabs>
        <div styleName="tab-container">
          { 
            // routes.map((route, i) => routeWithSubRoutes(route, i)) 
            routes.map((route, i) => createRouteWithHook(route, i))
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
