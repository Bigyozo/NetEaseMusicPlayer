import queryString from 'query-string';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { LoginParams } from '../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { SampleBack, SongSheet } from './data.types/common.types';
import { RecordVal, Signin, User, UserRecord, UserSheet } from './data.types/member.type';
import { API_CONFIG, ServicesModule } from './services.module';

export enum RecordType {
  allData,
  weekData
}

const records = ['allData', 'weekData'];

@Injectable({
  providedIn: ServicesModule
})
export class MemberService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {}

  login(formValue: LoginParams): Observable<User> {
    const params = new HttpParams({ fromString: queryString.stringify(formValue) });
    return this.http.get(this.uri + 'login/cellphone', { params }).pipe(map((res) => res as User));
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
      .pipe(map((res: UserRecord) => res[records[type]]));
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
}
