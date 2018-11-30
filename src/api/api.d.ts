/*
 * @Author: qiao 
 * @Date: 2018-11-28 14:02:57 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-11-29 19:02:15
 * api接口返回数据接口
 */
// 新歌接口 Banner
export interface IBanner {
  imgurl: string;
  title: string;
  extra: {
    tourl: string;
  }
}
// 歌曲
export interface ISong {
  filename: string;
  hash: string;
}

// 获取首页新歌接口数据
export interface INewSong {
  banner: IBanner[];
  data: ISong[]
}

export interface IRank {
  imgurl: string;
  rankname: string;
  rankid: string;
  id: number;
}

// 排行列表数据
export interface IRanks {
  rank: { list: IRank[] }
}

// 歌单列表项接口
export interface ISongListItem {
  specialname: string;
  playcount: number;
  specialid: number;
  imgurl: string;
  suid: number;
}

// 歌单列表数据
export interface ISongs { 
  plist: { 
    list: { info: ISongListItem[] }
  }
}

// 排行榜详情接口数据
export interface IRankInfo {
  info: {
    banner7url: string;
  },
  songs: {
    list: ISong[];
  }
}

// 歌单信息接口数据
export interface ISongListInfo {
  info: {
    list: { imgurl: string; intro: string }
  },
  list: { list: { info: ISong[] }}
}

// 歌手 
export interface ISinger {
  imgurl: string;
  singerid: number;
  singername: string;
}

export interface ISingerList {
  singers: {
    list: { info: ISinger[] }
  }
}

// 歌手信息接口数据
export interface ISingerInfo {
  info: { imgurl: string; intro: string },
  songs: { list: ISong[] }
} 
