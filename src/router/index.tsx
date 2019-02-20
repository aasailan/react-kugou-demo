import React from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";

import asyncComponent from '@/utils/asyncComponent';
import { RouteWithHook } from './hook';

export interface IRoute extends RouteProps {
  name?: string;
  routes?: IRoute[];
  redirect?: string;
  onEnter?: (params: RouteComponentProps) => any;
  onChange?: (params: RouteComponentProps) => any;
  onLeave?: (params: RouteComponentProps) => any;
}

export const newSongRoute: IRoute = {
  name: 'NewSong',
  exact: true,
  path: '/tab/newsong',
  component: asyncComponent(() => import('@/page/Tab/NewSong/NewSong'), 'NewSongPage'),
  onEnter: (params) => {
    console.log('Route Hook onEnter in NewSong');
    console.log(params);
  },
  onChange: (params) => {
    console.log('Route Hook onChange in NewSong');
    console.log(params);
  },
  onLeave: (params) => {
    console.log('Route Hook onLeave in NewSong');
    console.log(params);
  },
};

export const rankRoute: IRoute = {
  name: 'Rank',
  exact: true,
  path: '/tab/rank',
  component: asyncComponent(() => import('@/page/Tab/Rank/Rank'), 'RankPage')
};

export const songListRoute: IRoute = {
  name: 'SongList',
  exact: true,
  path: '/tab/songlist',
  component: asyncComponent(() => import('@/page/Tab/SongList/SongList'), 'SongListPage')
};

export const singerRoute: IRoute = {
  name: 'Singer',
  exact: true,
  path: '/tab/singer',
  component: asyncComponent(() => import('@/page/Tab/Singer/Singer'), 'Singer')
};

export const searchRoute: IRoute = {
  name: 'Search',
  exact: true,
  path: '/tab/search',
  component: asyncComponent(() => import('@/page/Tab/Search/Search'), 'SearchPage')
};

export const rankInfoRoute: IRoute = {
  name: 'RankInfo',
  exact: true,
  path: '/rank/info/:id',
  component: asyncComponent(() => import('@/page/RankInfo/RankInfo'), 'RankInfoPage')
};

export const songListInfoRoute: IRoute = {
  name: 'SongListInfo',
  exact: true,
  // NOTE: 如何将path内的参数定义与组件内的RouteParams接口定义结合起来
  path: '/plist/info/:id',
  component: asyncComponent(() => import('@/page/SongListInfo/SongListInfo'), 'SongListInfoPage')
};

export const singerListRoute: IRoute = {
  name: 'SingerList',
  exact: true,
  path: '/singer/list/:typeId',
  component: asyncComponent(() => import('@/page/SingerList/SingerList'), 'SingerListPage')
};

export const singerInfoRoute: IRoute = {
  name: 'SingerInfo',
  exact: true,
  path: '/singer/info/:singerId',
  component: asyncComponent(() => import('@/page/SingerInfo/SingerInfo'), 'SingerInfoPage')
};

export const routes: IRoute[] = [
  {
    path: "/tab",
    component: asyncComponent(() => import('@/page/Tab/Tab'), 'RouteTab'),
    routes: [
      newSongRoute,
      rankRoute,
      songListRoute,
      singerRoute,
      searchRoute
    ],
    onEnter: (params) => {
      console.log('Route Hook onEnter in tab');
      console.log(params);
    },
    onChange: (params) => {
      console.log('Route Hook onChange in tab');
      console.log(params);
    },
    onLeave: (params) => {
      console.log('Route Hook onLeave in tab');
      console.log(params);
    },
  },
  rankInfoRoute,
  songListInfoRoute,
  singerListRoute,
  singerInfoRoute,
  // 定义重定向默认路由
  {
    path: "/*",
    redirect: '/tab/newsong'
  }
];

/**
 * @description 输入路由配置，输出配置好Route组件
 * @export
 * @param {IRoute} route 自定义路由配置对象
 * @param {(number | null)} [key=null]
 * @returns <Route></Route>
 */
export function routeWithSubRoutes(route: IRoute, key: number | null = null) {
  const { path, exact, routes: subRoutes, redirect, component } = route;
  const Component = component as React.ComponentClass<any>;
  return (
    <Route
      key={key !== null ? key : ''}
      path={path}
      exact={!!exact}
      render={routeProps => (
        Component ? <Component {...routeProps} routes={subRoutes}/> : redirect ? 
          <Redirect from={path as string} to={redirect}/> : null
      )}
    />
  );
};

export function createRouteWithHook(route: IRoute, key: number | null = null) {
  const { path, exact, routes: subRoutes, redirect, component, ...hook } = route;
  const Component = component as React.ComponentClass<any>;
  return (
    <RouteWithHook
      {...hook}
      key={key !== null ? key : ''}
      path={path}
      exact={!!exact}
      render={routeProps => (
        Component ? <Component {...routeProps} routes={subRoutes}/> : redirect ? 
          <Redirect from={path as string} to={redirect}/> : null
      )}
    />
  );
};
