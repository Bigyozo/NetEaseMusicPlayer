import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd';
import {
  Banner,
  HotTag,
  Singer,
  SongSheet
} from 'src/app/services/data.types/common.types';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service ';

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
    private homeService: HomeService,
    private singerService: SingerService
  ) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalSheetList();
    this.getEnterSingers();
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

  private getEnterSingers() {
    this.singerService.getEnterSinger().subscribe((singerList) => {
      console.log(singerList);
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
}
