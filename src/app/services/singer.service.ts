import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/internal/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Singer, SingerDetail } from './data.types/common.types';
import { API_CONFIG, ServicesModule } from './services.module';

type SingerParams = {
  offset: string;
  limit: string;
  type: '-1' | '1' | '2' | '3';
  area: '-1' | '7' | '96' | '8' | '16' | '0';
};

const defaultParams: SingerParams = {
  offset: '0',
  limit: '9',
  type: '-1',
  area: '8'
};

@Injectable({
  providedIn: ServicesModule
})
export class SingerService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {}

  getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
    return this.http
      .get(this.uri + 'artist/list', { params: defaultParams })
      .pipe(map((res: { artists: Singer[] }) => res.artists));
  }

  // 获取歌手详情和热门歌曲
  getSingerDetail(id: string): Observable<SingerDetail> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.uri + 'artists', { params }).pipe(map((res) => res as SingerDetail));
  }

  // 获取相似歌手详情
  getSimilarSinger(id: string): Observable<Singer[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.uri + 'simi/artist', { params }).pipe(
      map((res: { artists: Singer[] }) => res.artists),
      catchError((err) => {
        console.log(err);
        return of([]);
      })
    );
  }
}
