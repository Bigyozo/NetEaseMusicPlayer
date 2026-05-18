import queryString from 'query-string';
import { Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/internal/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { SheetList, Song, SongSheet } from './data.types/common.types';
import { API_CONFIG, ServicesModule } from './services.module';
import { SongService } from './song.service';

export interface SheetParams {
  offset: number;
  limit: number;
  order: 'hot' | 'highquality';
  cat: string;
}

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string,
    private songService: SongService
  ) {}

  // 获取歌单列表
  getSheets(args: SheetParams): Observable<SheetList> {
    const params = new HttpParams({ fromString: queryString.stringify(args) });
    return this.http
      .get(this.uri + 'top/playlist', { params })
      .pipe(map((res) => res as SheetList));
  }

  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http
      .get(this.uri + 'playlist/detail', { params })
      .pipe(map((res: { playlist: SongSheet }) => res.playlist));
  }

  playsheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id).pipe(
      pluck('tracks'),
      switchMap((tracks) => this.songService.getSongList(tracks))
    );
  }
}
