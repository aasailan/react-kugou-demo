/*
 * @Author: qiao 
 * @Date: 2019-02-18 15:54:24 
 * @Last Modified by: qiao
 * @Last Modified time: 2019-02-18 17:22:25
 * 使用HOC完成react router hook
 * 先不考虑Route中的Component组件
 */
import React from "react";
import { Route, RouteComponentProps, RouteProps } from 'react-router';

interface IRouteHookProxyProps {
  routeComponentProps: RouteComponentProps;
  render?: (props: RouteComponentProps) => React.ReactNode;
  onEnter?: (params: RouteComponentProps) => any;
  onChange?: (params: RouteComponentProps) => any;
  onLeave?: (params: RouteComponentProps) => any;
}

// 代理组件
class RouteHookProxy extends React.Component<IRouteHookProxyProps> {

  componentDidMount() {
    const { onEnter, routeComponentProps } = this.props;
    onEnter && typeof onEnter === 'function' && onEnter(routeComponentProps);
  }

  componentWillUnmount() {
    const { onLeave, routeComponentProps } = this.props;
    onLeave && typeof onLeave === 'function' && onLeave(routeComponentProps);
  }

  componentDidUpdate() {
    const { onChange, routeComponentProps } = this.props;
    onChange && typeof onChange === 'function' && onChange(routeComponentProps);
  }

  render() {
    const { render, routeComponentProps } = this.props;
    // if (Component) {
    //   return <Component/>;
    // }
    return render && render(routeComponentProps);
  }
}

interface IRouteWithHookProps extends RouteProps {
  onEnter?: (params: RouteComponentProps) => any;
  onChange?: (params: RouteComponentProps) => any;
  onLeave?: (params: RouteComponentProps) => any;
}

/**
 * @bug 暂时没有考虑Route组件的component属性，必须使用render属性
 * @description 携带hook的路由组件
 * @export
 * @param {IRouteWithHookProps} {render, onEnter, onChange, onLeave, ...props }
 * @returns
 */
export function RouteWithHook({render, onEnter, onChange, onLeave, ...props }: IRouteWithHookProps) {
  return <Route
    {...props}
    render={(routeComponentProps: RouteComponentProps) => 
      <RouteHookProxy routeComponentProps={routeComponentProps} render={render} 
        onEnter={onEnter} onChange={onChange} onLeave={onLeave}/>}
  />
};
