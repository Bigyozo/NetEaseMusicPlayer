import { Observable } from 'rxjs';
import { SingerDetail, SongSheet } from 'src/app/services/data.types/common.types';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { SingerService } from '../../../services/singer.service ';

@Injectable()
export class SingerResolverService implements Resolve<SingerDetail> {
  constructor(private singerService: SingerService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetail> {
    return this.singerService.getSingerDetail(route.paramMap.get('id'));
  }
}
