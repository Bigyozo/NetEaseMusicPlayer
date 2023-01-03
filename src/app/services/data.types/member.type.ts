import { Song, SongSheet } from './common.types';

export interface Signin {
  code: number;
  point?: number;
  msg?: string;
}

export interface User {
  //用户等级
  level?: number;
  listenSongs?: number;
  profile: {
    userId: number;
    nickname: string;
    //头像
    avatarUrl: string;
    backgroundUrl: string;
    //个人简介
    signature: string;
    // 性别
    gender: number;
    // 粉丝
    followeds: number;
    // 关注
    follows: number;
    // 动态
    eventCount: number;
  };
}

export interface RecordVal {
  playCount: number;
  score: number;
  song: Song;
}

type recordKeys = 'weekData' | 'allData';

export type UserRecord = {
  [key in recordKeys]: RecordVal[];
};

export interface UserSheet {
  self: SongSheet[];
  subscribed: SongSheet[];
}
