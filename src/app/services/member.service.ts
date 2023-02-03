import queryString from 'query-string';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { SampleBack, SongSheet } from './data.types/common.types';
import {
    EmailLoginParams, PhoneLoginParams, RecordVal, Signin, User, UserRecord, UserSheet
} from './data.types/member.type';
import { API_CONFIG, ServicesModule } from './services.module';

export enum RecordType {
  allData,
  weekData
}

export type LikeSongParams = {
  pid: string;
  tracks: string;
};

@Injectable({
  providedIn: ServicesModule
})
export class MemberService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {}

  phoneLogin(formValue: PhoneLoginParams): Observable<User> {
    const params = new HttpParams({ fromString: queryString.stringify(formValue) });
    return this.http.get(this.uri + 'login/cellphone', { params }).pipe(map((res) => res as User));
  }

  emailLogin(formValue: EmailLoginParams): Observable<User> {
    const params = new HttpParams({ fromString: queryString.stringify(formValue) });
    return this.http.get(this.uri + 'login', { params }).pipe(map((res) => res as User));
  }

  getUserDetail(uid: string): Observable<User> {
    const params = new HttpParams({ fromString: queryString.stringify({ uid }) });
    return this.http.get(this.uri + 'user/detail', { params }).pipe(map((res) => res as User));
  }

  logout(): Observable<SampleBack> {
    return this.http.get(this.uri + 'logout').pipe(map((res) => res as SampleBack));
  }

  //签到
  signin(): Observable<Signin> {
    const params = new HttpParams({ fromString: queryString.stringify({ type: 1 }) });
    return this.http.get(this.uri + 'daily_signin', { params }).pipe(map((res) => res as Signin));
  }

  //听歌记录
  getUserRecord(uid: string, type = RecordType.weekData): Observable<RecordVal[]> {
    const params = new HttpParams({ fromString: queryString.stringify({ uid, type }) });
    return this.http
      .get(this.uri + 'user/record', { params })
      .pipe(map((res: UserRecord) => res[RecordType[type]]));
  }

  //用户歌单
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

  //收藏歌曲
  likeSong({ pid, tracks }: LikeSongParams) {
    const params = new HttpParams({
      fromString: queryString.stringify({ pid, tracks, op: 'add' })
    });
    return this.http
      .get(this.uri + 'playlist/tracks', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  //新建歌单
  createSheet(name: string): Observable<string> {
    const params = new HttpParams({ fromString: queryString.stringify({ name }) });
    return this.http
      .get(this.uri + 'playlist/create', { params })
      .pipe(map((res: SampleBack) => res.id.toString()));
  }
}
