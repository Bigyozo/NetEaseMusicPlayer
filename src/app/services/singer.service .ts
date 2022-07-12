import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';
import { Singer } from './data.types/common.types';

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
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string
  ) {}

  getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
    return this.http
      .get(this.uri + 'artist/list', { params: defaultParams })
      .pipe(map((res: { artists: Singer[] }) => res.artists));
  }
}
