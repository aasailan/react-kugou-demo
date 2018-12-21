/*
 * @Author: qiao 
 * @Date: 2018-11-25 12:29:37 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-21 16:11:09
 * api
 */
import axios, { AxiosPromise, CancelToken } from 'axios';
import { IHotSearch, INewSong, IRankInfo, IRanks, ISingerInfo, ISingerList, ISong, ISongInfo, ISongListInfo, ISongs } from './api';
import { NetworkError } from './networkError';

// NOTE: 需要区分生产和开发环境
const DEV_API_HOST = 'http://localhost:3000';
const PRO_API_HOST = '这里填写你的生产ip地址与端口'; 
let apiHost;
if (process.env.NODE_ENV !== 'production') {
  apiHost = DEV_API_HOST;
} else {
  apiHost = PRO_API_HOST;
}

export const service = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  baseURL: apiHost,
  withCredentials: true,
  timeout: 20000 // request timeout
});

service.interceptors.request.use((config) => {
  return config;
}, error => {
  return new NetworkError(error);
});

service.interceptors.response.use((response) => {
  // 
  return response;
}, error => {
  // NOTE: 如果请求被取消，则会运行这个地方
  if (axios.isCancel(error)) {
    throw new NetworkError(error, NetworkError.ERROR_TYPE.USER_CANCEL);
  }
  throw new NetworkError(error);
});

const Api = {
  getNewSong(json: boolean = true): AxiosPromise<INewSong> {
    return service.get('/proxy', {
      params: { json }
    });
  },

  getRanks(json: boolean = true): AxiosPromise<IRanks> {
    return service.get('/proxy/rank/list', { params: { json } });
  },

  getSongs(json: boolean = true): AxiosPromise<ISongs> {
    return service.get('/proxy/plist/index', { params: { json } });
  },

  getRankInfo({ rankid, page = 1, json = true }: { rankid: number, page?: number, json?: boolean}, 
    token?: CancelToken): AxiosPromise<IRankInfo> {
    return service.get('/proxy/rank/info', { 
      params: { rankid, page, json },
      cancelToken: token
    });
  },

  getSongListInfo({ infoId, json = true }: { infoId: string, json?: boolean },
    token?: CancelToken): AxiosPromise<ISongListInfo> {
    return service.get(`/proxy/plist/list/${infoId}`, {
      params: { json },
      cancelToken: token
    });
  },

  getSingerList({ singerType, json = true }: { singerType: string, json?: boolean },
    token?: CancelToken): AxiosPromise<ISingerList> {
    return service.get(`/proxy/singer/list/${singerType}`, {
      params: { json },
      cancelToken: token
    });
  },

  getSingerInfo({ singerId, json = true }: { singerId: string, json?: boolean },
    token?: CancelToken): AxiosPromise<ISingerInfo> {
    return service.get(`/proxy/singer/info/${singerId}`, {
      params: { json },
      cancelToken: token
    });
  },

  /**
   * @description 获取歌曲信息
   * @param {{ hash: string, r: string }} { hash, r = 'play/getdata' }
   * @param {CancelToken} [token]
   * @returns {AxiosPromise<{ data: ISongInfo }>}
   */
  getSongInfo({ hash }: { hash: string, r?: string },
    token?: CancelToken): AxiosPromise<{ data: ISongInfo }> {
    return service.get('/bproxy/yy/index.php?r=play/getdata', {
      params: { hash },
      cancelToken: token
    });
  },

  /**
   * @description 获取热门搜索
   * @param {CancelToken} [token]
   * @returns {AxiosPromise<IHotSearch>}
   */
  getHotSearch(token?: CancelToken): AxiosPromise<{ data: { info: IHotSearch[] } }> {
    return service.get('/aproxy/api/v3/search/hot?format=json&plat=0&count=30', {
      cancelToken: token
    });
  },

  searchSong(keyword: string, token?: CancelToken): AxiosPromise<{ data: { info: ISong[], total: number }}> {
    return service.get(`/aproxy/api/v3/search/song?format=json&keyword=${keyword}&page=1&pagesize=30&showtype=1`, {
      cancelToken: token
    });
  }
}

export default Api;