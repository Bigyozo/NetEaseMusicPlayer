import { NzCarouselComponent } from 'ng-zorro-antd';
import { map } from 'rxjs/internal/operators';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data.types/common.types';
import { User } from 'src/app/services/data.types/member.type';
import { MemberService } from 'src/app/services/member.service';
import { SheetService } from 'src/app/services/sheet.service';
import { MemberState, ModalTypes } from 'src/app/store/reducers/member.reducer';

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { BatchActionsService } from '../../store/batch-actions.service';
import { AppStoreModule } from '../../store/index';
import { getUserId } from '../../store/selectors/member.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;

  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  singerList: Singer[];
  user: User;

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetService: SheetService,
    private batchActionsService: BatchActionsService,
    private store$: Store<AppStoreModule>,
    private memberService: MemberService
  ) {
    this.route.data
      .pipe(map((res) => res.homeDatas))
      .subscribe(([banners, tags, songSheetList, singerList]) => {
        this.banners = banners;
        this.hotTags = tags;
        this.songSheetList = songSheetList;
        this.singerList = singerList;
      });

    this.store$
      .pipe(select(createFeatureSelector<MemberState>('member')), select(getUserId))
      .subscribe((userId) => {
        if (userId) {
          this.getUserDetail(userId);
        } else {
          this.user = null;
        }
      });
  }

  private getUserDetail(userId: string) {
    this.memberService.getUserDetail(userId).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {}

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number) {
    this.sheetService.playsheet(id).subscribe((list) => {
      this.batchActionsService.selectPlayList({ list, index: 0 });
    });
  }

  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }

  openModal() {
    this.batchActionsService.controlModal(true, ModalTypes.Default);
  }
}
