import { Song, SongSheet } from './common.types';

export interface Signin {
  code: number;
  point?: number;
  msg?: string;
}

export interface User {
  // ユーザーレベル
  level?: number;
  listenSongs?: number;
  cookie: string;
  profile: {
    userId: number;
    nickname: string;
    // アバター
    avatarUrl: string;
    backgroundUrl: string;
    // 自己紹介
    signature: string;
    // 性別
    gender: number;
    // フォロワー
    followeds: number;
    // フォロー
    follows: number;
    // アクティビティ
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

export interface PhoneLoginParams {
  phone: number;
  password: string;
  remember: boolean;
}

export interface EmailLoginParams {
  email: string;
  password: string;
  remember: boolean;
}
