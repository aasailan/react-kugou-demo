/*
 * @Author: qiao 
 * @Date: 2018-11-24 17:50:29 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-24 18:55:10
 * 异步加载组件
 */
import React from 'react';

interface IState {
  loading: boolean;
}

/**
 * @description HOC 异步加载组件 NOTE: 需要给改异步组件也加上loading页和加载错误页面
 * @export
 * @param {() => Promise<any>} asyncImport 异步加载组件函数
 * @param {string} [componentName='default'] 需要加载的组件名
 * @returns
 */
export default function asyncComponent(asyncImport: () => Promise<any>, componentName: string = 'default') {
  class AsyncComponent extends React.Component<any, IState> {

    private component: any;

    constructor(props: any) {
      super(props);
      this.state = {
        loading: true
      }
    }
  
    async componentDidMount() {
      const module = await asyncImport();
      this.component = module[componentName];

      this.setState({
        loading: false
      });
    }

    render() {
      const { loading } = this.state;
      // TODO: 这里以后可以加上异步加载动画
      return loading ? null : <this.component {...this.props}/>
    }

  }

  return AsyncComponent;
}


