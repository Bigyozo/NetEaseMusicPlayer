import queryString from 'query-string';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { SampleBack, SongSheet } from './data.types/common.types';
import {
    EmailLoginParams, PhoneLoginParams, RecordVal, Signin, User, UserRecord, UserSheet
} from './data.types/member.type';
import { API_CONFIG } from './tokens';

export enum RecordType {
  allData,
  weekData
}

export interface LikeSongParams {
  pid: string;
  tracks: string;
}

export interface ShareParams {
  id: string;
  msg: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private uri = inject(API_CONFIG);
  constructor(private http: HttpClient) {}

  phoneLogin(formValue: PhoneLoginParams): Observable<User> {
    const params = new HttpParams({ fromString: queryString.stringify(formValue) });
    return this.http.get(this.uri + 'login/cellphone', { params }).pipe(
      map((res) => {
        if (res.hasOwnProperty('message')) {
          const err = res as Error;
          throw new Error(err.message);
        } else {
          return res as User;
        }
      })
    );
  }

  emailLogin(formValue: EmailLoginParams): Observable<User> {
    const params = new HttpParams({ fromString: queryString.stringify(formValue) });
    return this.http.get(this.uri + 'login', { params }).pipe(
      map((res) => {
        if (res.hasOwnProperty('message')) {
          const err = res as Error;
          throw new Error(err.message);
        } else {
          return res as User;
        }
      })
    );
  }

  getUserDetail(uid: string): Observable<User> {
    const params = new HttpParams({ fromString: queryString.stringify({ uid }) });
    return this.http.get(this.uri + 'user/detail', { params }).pipe(map((res) => res as User));
  }

  logout(): Observable<SampleBack> {
    return this.http.get(this.uri + 'logout').pipe(map((res) => res as SampleBack));
  }

  // チェックイン
  signin(): Observable<Signin> {
    const params = new HttpParams({ fromString: queryString.stringify({ type: 1 }) });
    return this.http.get(this.uri + 'daily_signin', { params }).pipe(map((res) => res as Signin));
  }

  // 再生履歴
  getUserRecord(uid: string, type = RecordType.weekData): Observable<RecordVal[]> {
    const params = new HttpParams({ fromString: queryString.stringify({ uid, type }) });
    return this.http
      .get(this.uri + 'user/record', { params })
      .pipe(map((res: UserRecord) => res[RecordType[type]]));
  }

  // ユーザーのプレイリスト
  getUserSheets(uid: string): Observable<UserSheet> {
    const params = new HttpParams({ fromString: queryString.stringify({ uid }) });
    return this.http.get(this.uri + 'user/playlist', { params }).pipe(
      map((res: { playlist: SongSheet[] }) => {
        const list = res.playlist;
        return {
          self: list.filter((item) => !item.subscribed),
          subscribed: list.filter((item) => item.subscribed)
        };
      })
    );
  }

  // 楽曲をお気に入り
  likeSong({ pid, tracks }: LikeSongParams) {
    const params = new HttpParams({
      fromString: queryString.stringify({ pid, tracks, op: 'add' })
    });
    return this.http
      .get(this.uri + 'playlist/tracks', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  // プレイリストをお気に入り
  likeSheet(id: string, t = 1): Observable<number> {
    const params = new HttpParams({
      fromString: queryString.stringify({ id, t })
    });
    return this.http
      .get(this.uri + 'playlist/subscribe', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  // アーティストをお気に入り
  likeSinger(id: string, t = 1): Observable<number> {
    const params = new HttpParams({
      fromString: queryString.stringify({ id, t })
    });
    return this.http
      .get(this.uri + 'artist/sub', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  // プレイリストを作成
  createSheet(name: string): Observable<string> {
    const params = new HttpParams({ fromString: queryString.stringify({ name }) });
    return this.http
      .get(this.uri + 'playlist/create', { params })
      .pipe(map((res: SampleBack) => res.id.toString()));
  }

  // シェア
  shareResource({ id, msg, type }: ShareParams): Observable<number> {
    const params = new HttpParams({
      fromString: queryString.stringify({ id, msg, type })
    });
    return this.http
      .get(this.uri + 'share/resource', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  // 認証コードを送信
  sendCode(phone: number): Observable<number> {
    const params = new HttpParams({ fromString: queryString.stringify({ phone }) });
    return this.http
      .get(this.uri + 'captcha/sent', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  // 認証コードを検証
  checkCode(phone: number, captcha: number): Observable<number> {
    const params = new HttpParams({ fromString: queryString.stringify({ phone, captcha }) });
    return this.http
      .get(this.uri + 'captcha/verify', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  // 登録済みか確認
  checkExist(phone: number): Observable<number> {
    const params = new HttpParams({ fromString: queryString.stringify({ phone }) });
    return this.http
      .get(this.uri + 'cellphone/existence/check', { params })
      .pipe(map((res: { exist: number }) => res.exist));
  }
}
