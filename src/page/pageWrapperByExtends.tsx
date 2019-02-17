/*
 * @Author: qiao 
 * @Date: 2019-02-17 14:39:27 
 * @Last Modified by: qiao
 * @Last Modified time: 2019-02-17 15:26:37
 * 使用继承的方式实现HOC
 */
import { NetworkError } from '@/api/networkError';
import networkErrorPng from '@/assets/imgs/network_error.png';
import unknowErrorPng from '@/assets/imgs/unknow_error.png';
import ErrorHint, { IProps as ErrorHintProps } from '@/components/Error/Error';
import Loading from '@/components/Loading/Loading';
import React from 'react';
import { RouteComponentProps } from 'react-router';

interface IError extends ErrorHintProps {
  error: Error;
}

export interface IMyPageState<D = any> {
  data: D;
  loading: boolean;
  error: IError | null;
}

export interface IMyPageMethod {
  updateError: (e: Error) => void;
}

// 使用继承的方式实现HOC
// 这样可以让获取数据的逻辑由参数组件的生命周期实现，同时劫持参数组件的渲染方法。
// 比起index.tsx中代理类HOC，这个方式更加贴合需求和实现更加漂亮
// 但是不管是哪种实现方式，HOC对参数组件总是有 固定参数的约束（下面的继承类实现要求参数组件的state中有loading、error、data等属性，之前的代理类则要求参数组件
// 的props要传入一系列规定的属性）
export function pageWrapperGeneratorByExtends(component: React.ComponentClass, LoadingComponent: React.FunctionComponent<any> = Loading) {
  
  const Component = component as React.ComponentClass<RouteComponentProps, IMyPageState>;

  class PageWrapper2 extends Component {

    constructor(props) {
      super(props);
      !this.state ? this.state = {
        loading: true,
        error: null,
        data: null,
      } : this.state = {
        ...this.state,
        loading: true,
        error: null,
        data: null,
      };
      this.getCache();
    }

    // 根据url为key，获取缓存数据
    getCache() {
      const { location: { pathname } } = this.props;
      let data: any = localStorage.getItem(pathname);
      if (data) {
        data = JSON.parse(data);
        this.state = {
          ...this.state,
          loading: false,
          data,
        };
      }
    }

    componentWillUnmount() {
      super.componentWillUnmount && super.componentWillUnmount();
      const { location: { pathname } } = this.props;
      try {
        localStorage.setItem(pathname, JSON.stringify(this.state.data));
      } catch (e) {
        console.error(e);
      }
    }
         // 错误处理
    updateError = (e: Error) => {
      console.error(e);
      if (e instanceof NetworkError) {

        if (e.type === NetworkError.ERROR_TYPE.USER_CANCEL) {
          // 用户主动取消，不做任何响应
          return;
        }

        // 网络错误
        this.setState({
          error: {
            error: e,
            title: '网络出错啦，点击重新加载',
            clickHandler: this.clearError,
            img: networkErrorPng
          }
        });
      } else {
        // 未知错误
        this.setState({
          error: {
            error: e,
            title: '似乎出了点问题，点击返回首页',
            clickHandler: this.toIndex,
            img: unknowErrorPng
          }
        })
      }
    }

    clearError = () => {
      this.setState({
        error: null
      });
    }

    toIndex = () => {
      const { history } = this.props;
      history.replace({
        pathname: '/tab/newSong'
      });
    }

    // 劫持参数组件的渲染
    render() {
      const { data, error } = this.state;
      // 显示loading
      if (!data && !error) {
        return <LoadingComponent/>;
      }
        
      // 显示错误页面
      if (!data && error) {
        return <ErrorHint clickHandler={error.clickHandler} title={error.title} img={error.img}/>;
      }
        
      // 显示参数组件正常页面
      return super.render();
    }
  }

  return PageWrapper2;
}

