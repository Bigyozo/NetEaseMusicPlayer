import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Banner, HotTag, SongSheet } from './data.types/common.types';
import { API_CONFIG } from './tokens';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private uri = inject(API_CONFIG);
  constructor(private http: HttpClient) {}

  getBanners(): Observable<Banner[]> {
    return this.http
      .get(this.uri + 'banner')
      .pipe(map((res: { banners: Banner[] }) => res.banners));
  }

  getHotTags(): Observable<HotTag[]> {
    return this.http.get(this.uri + 'playlist/hot').pipe(
      map((res: { tags: HotTag[] }) => {
        return res.tags
          .sort((x: HotTag, y: HotTag) => {
            return x.position - y.position;
          })
          .slice(0, 5);
      })
    );
  }

  getPersonalSheetList(): Observable<SongSheet[]> {
    return this.http
      .get(this.uri + 'personalized')
      .pipe(map((res: { result: SongSheet[] }) => res.result.slice(0, 16)));
  }
}
