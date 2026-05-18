import { forkJoin, Observable } from 'rxjs';
import { Singer, SingerDetail } from 'src/app/services/data.types/common.types';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { SingerService } from '../../../services/singer.service';

type SingerDetailData = [SingerDetail, Singer[]];
@Injectable()
export class SingerResolverService implements Resolve<SingerDetailData> {
  constructor(private singerService: SingerService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetailData> {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.singerService.getSingerDetail(id),
      this.singerService.getSimilarSinger(id)
    ]);
  }
}
