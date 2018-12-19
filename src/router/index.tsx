import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import asyncComponent from '@/utils/asyncComponent';

export interface IRoute extends RouteProps {
  name?: string;
  routes?: IRoute[];
  redirect?: string;
}

export const newSongRoute: IRoute = {
  name: 'NewSong',
  exact: true,
  path: '/tab/newSong',
  component: asyncComponent(() => import('@/page/Tab/NewSong/NewSong'), 'NewSongPage')
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
  path: '/tab/songList',
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
    ]
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

export function routeWithSubRoutes(route: IRoute, key: number | null = null, props: any = null) {
  const { path, exact, routes: subRoutes, redirect, component: Component } = route;
  return (
    <Route
      key={key !== null ? key : ''}
      path={path}
      exact={!!exact}
      render={routeProps => (
        Component ? <Component {...routeProps} {...props} routes={subRoutes}/> : redirect ? 
          <Redirect from={path as string} to={redirect}/> : null
      )}
    />
  );
};
