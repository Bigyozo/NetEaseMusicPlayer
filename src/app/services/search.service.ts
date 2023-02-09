import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { SearchResult } from './data.types/common.types';
import { API_CONFIG, ServicesModule } from './services.module';

@Injectable({
  providedIn: ServicesModule
})
export class SearchService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {}

  search(keywords: string): Observable<SearchResult> {
    const params = new HttpParams().set('keywords', keywords);
    return this.http
      .get(this.uri + 'search/suggest', { params })
      .pipe(map((res: { result: SearchResult }) => res.result));
  }
}
