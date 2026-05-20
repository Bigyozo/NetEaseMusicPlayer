import { NzCarouselComponent, NzCarouselModule } from 'ng-zorro-antd/carousel';
import { map } from 'rxjs/operators';
import { LANGUAGE_JP } from 'src/app/language/jp';
import {
    Banner, HotTag, LanguageRes, Singer, SongSheet
} from 'src/app/services/data.types/common.types';
import { User } from 'src/app/services/data.types/member.type';
import { LanguageService } from 'src/app/services/language.service';
import { MemberService } from 'src/app/services/member.service';
import { SheetService } from 'src/app/services/sheet.service';
import { ModalTypes } from 'src/app/store/member-store.service';
import { SingleSheetComponent } from '../../share/wy-ui/single-sheet/single-sheet.component';
import { ImgDefaultDirective } from '../../share/directives/img-default.directive';
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';
import { MemberCardComponent } from './components/member-card/member-card.component';

import { Component, OnInit, ViewChild, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { BatchActionsService } from '../../store/batch-actions.service';
import { MemberStoreService } from '../../store/member-store.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCarouselModule,
    NzIconModule,
    ImgDefaultDirective,
    SingleSheetComponent,
    WyCarouselComponent,
    MemberCardComponent
  ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  lanRes: LanguageRes = LANGUAGE_JP;
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
    private memberStore: MemberStoreService,
    private memberService: MemberService,
    private languageService: LanguageService
  ) {
    this.route.data
      .pipe(map((res) => res.homeDatas))
      .subscribe(([banners, tags, songSheetList, singerList]) => {
        this.banners = banners;
        this.hotTags = tags;
        this.songSheetList = songSheetList;
        this.singerList = singerList;
      });

    effect(() => {
      const userId = this.memberStore.userId();
      if (userId) {
        this.getUserDetail(userId);
      } else {
        this.user = null;
      }
    });
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
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
