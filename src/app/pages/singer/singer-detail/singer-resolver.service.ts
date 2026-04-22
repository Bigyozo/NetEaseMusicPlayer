import { EMPTY, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Singer, SingerDetail } from 'src/app/services/data.types/common.types';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { SingerService } from '../../../services/singer.service';

type SingerDetailData = [SingerDetail, Singer[]];
@Injectable()
export class SingerResolverService implements Resolve<SingerDetailData> {
  constructor(private singerService: SingerService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetailData> {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.singerService.getSingerDetail(id),
      this.singerService.getSimilarSinger(id)
    ]).pipe(
      catchError(() => {
        this.router.navigate(['/home']);
        return EMPTY;
      })
    );
  }
}
