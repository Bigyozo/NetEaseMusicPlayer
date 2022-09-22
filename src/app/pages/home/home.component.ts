import { NzCarouselComponent } from 'ng-zorro-antd';
import { map } from 'rxjs/internal/operators';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data.types/common.types';
import { SheetService } from 'src/app/services/sheet.service';
import { AppStoreModule } from 'src/app/store';
import { PlayState } from 'src/app/store/reducers/player.reducer';

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { BatchActionsService } from '../../store/batch-actions.service';

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

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private batchActionsService: BatchActionsService
  ) {
    this.route.data
      .pipe(map((res) => res.homeDatas))
      .subscribe(([banners, tags, songSheetList, singerList]) => {
        this.banners = banners;
        this.hotTags = tags;
        this.songSheetList = songSheetList;
        this.singerList = singerList;
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
}
