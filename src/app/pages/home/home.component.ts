import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd';
import {
  Banner,
  HotTag,
  SongSheet
} from 'src/app/services/data.types/common.types';
import { HomeService } from 'src/app/services/home.service';

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

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(private homeService: HomeService) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalSheetList();
  }

  private getBanners() {
    this.homeService.getBanners().subscribe((banners) => {
      this.banners = banners;
    });
  }

  private getHotTags() {
    this.homeService.getHotTags().subscribe((tags) => {
      this.hotTags = tags;
    });
  }

  private getPersonalSheetList() {
    this.homeService.getPersonalSheetList().subscribe((songSheetList) => {
      this.songSheetList = songSheetList;
    });
  }

  ngOnInit() {}

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }
}
