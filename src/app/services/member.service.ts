import queryString from 'query-string';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { LoginParams } from '../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { Banner, HotTag, SongSheet } from './data.types/common.types';
import { SampleBack, User } from './data.types/member.type';
import { API_CONFIG, ServicesModule } from './services.module';

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
}
