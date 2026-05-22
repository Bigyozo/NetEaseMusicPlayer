import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Singer, SingerDetail } from './data.types/common.types';
import { API_CONFIG } from './tokens';

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
  providedIn: 'root'
})
export class SingerService {
  private uri = inject(API_CONFIG);
  constructor(private http: HttpClient) {}

  getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
    return this.http
      .get(this.uri + 'artist/list', { params: defaultParams })
      .pipe(map((res: { artists: Singer[] }) => res.artists));
  }

  // アーティスト詳細と人気曲を取得
  getSingerDetail(id: string): Observable<SingerDetail> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.uri + 'artists', { params }).pipe(map((res) => res as SingerDetail));
  }

  // 似たアーティストの詳細を取得
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
