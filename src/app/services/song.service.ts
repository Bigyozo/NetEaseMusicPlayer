import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';
import { Song, SongUrl } from './data.types/common.types';

@Injectable({
  providedIn: ServicesModule
})
export class SongService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string
  ) {}

  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http
      .get(this.uri + 'song/url', { params })
      .pipe(map((res: { data: SongUrl[] }) => res.data));
  }

  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map((item) => item.id).join(',');
    return new Observable((observable) => {
      this.getSongUrl(ids).subscribe((urls) => {
        observable.next(this.generateSongList(songArr, urls));
      });
    });
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
}
