import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Lyric, Song, SongUrl } from './data.types/common.types';
import { API_CONFIG, ServicesModule } from './services.module';

@Injectable({
  providedIn: ServicesModule
})
export class SongService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {}

  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http
      .get(this.uri + 'song/url', { params })
      .pipe(map((res: { data: SongUrl[] }) => res.data));
  }

  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map((item) => item.id).join(',');
    return this.getSongUrl(ids).pipe(map((urls) => this.generateSongList(songArr, urls)));
    // new Observable((observable) => {
    //   this.getSongUrl(ids).subscribe((urls) => {
    //     observable.next(this.generateSongList(songArr, urls));
    //   });
    // });
  }

  private generateSongList(songArr: Song[], urls: SongUrl[]): Song[] {
    const result = [];
    songArr.forEach((song) => {
      let url = urls.find((url) => url.id === song.id).url;
      if (url) {
        result.push({ ...song, url });
      }
    });
    return result;
  }

  getSongDetail(id: string): Observable<Song> {
    const params = new HttpParams().set('ids', id);
    return this.http
      .get(this.uri + 'song/detail', { params })
      .pipe(map((res: { songs: Song }) => res.songs[0]));
  }

  getLyric(id: number): Observable<Lyric> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'lyric', { params }).pipe(
      map((res: { [key: string]: { lyric: string } }) => {
        try {
          return {
            lyric: res.lrc.lyric,
            tlyric: res.tlyric.lyric
          };
        } catch (err) {
          return {
            lyric: '',
            tlyric: ''
          };
        }
      })
    );
  }
}
