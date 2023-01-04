import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data.types/common.types';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable({ providedIn: 'root' })
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(
    private homeService: HomeService,
    private singerService: SingerService // private memberService: MemberService,
  ) // private storgeService: StorgeService
  {}

  resolve(): Observable<HomeDataType> {
    // const userId = this.storgeService.getStorge('wyUserId');
    // let detail$ = of(null);
    // if (userId) {
    //   detail$ = this.memberService.getUserDetail(userId);
    // }
    return forkJoin([
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalSheetList(),
      this.singerService.getEnterSinger()
    ]).pipe(first());
  }
}
