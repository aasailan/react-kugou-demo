/*
 * @Author: qiao 
 * @Date: 2018-11-25 12:29:37 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-29 19:24:15
 * api
 */
import axios, { AxiosPromise, CancelToken } from 'axios';
import { INewSong, IRankInfo, IRanks, ISingerInfo, 
  ISingerList, ISongListInfo, ISongs } from './api';

// TODO: 需要区分生产和开发环境
const API_HOST = 'http://localhost:3000';

export const service = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  baseURL: API_HOST,
  withCredentials: true,
  timeout: 20000 // request timeout
});

service.interceptors.request.use((config) => {
  return config;
}, error => {
  return new Error(error);
});

service.interceptors.response.use((response) => {
  return response;
}, error => {
  // NOTE: 如果请求被取消，则会运行这个地方
  throw new Error(error);
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
  }
}

export default Api;