import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SongService } from 'src/app/services/song.service';
import { AppStoreModule } from 'src/app/store';
import { SetShareInfo } from 'src/app/store/actions/member.action';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { findIndex } from 'src/app/utils/array';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { Singer, SingerDetail, Song } from '../../../services/data.types/common.types';
import { getCurrentSong } from '../../../store/selectors/play.selectors';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {
  singerDetail: SingerDetail;
  currentSong: Song;
  currentIndex = -1;
  private destroy$ = new Subject<void>();
  simiSingers: Singer[];

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songService: SongService,
    private batchActionsService: BatchActionsService,
    private nzMessageService: NzMessageService
  ) {
    this.route.data.pipe(map((res) => res.singerDetail)).subscribe(([detail, simiSingers]) => {
      this.singerDetail = detail;
      this.simiSingers = simiSingers;
      this.listenCurrent();
    });
  }

  private listenCurrent() {
    this.store$
      .pipe(
        select(createFeatureSelector<PlayState>('player')),
        select(getCurrentSong),
        takeUntil(this.destroy$)
      )
      .subscribe((song) => {
        this.currentSong = song;
        if (song) {
          this.currentIndex = findIndex(this.singerDetail.hotSongs, song);
        } else {
          this.currentIndex = -1;
        }
      });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLikeSinger() {}

  onAddSongs(songs: Song[], isPlay = false) {
    this.songService.getSongList(songs).subscribe((list) => {
      if (list.length) {
        if (isPlay) {
          this.batchActionsService.selectPlayList({ list, index: 0 });
        } else {
          this.batchActionsService.insertSongs(list);
        }
      }
    });
  }

  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songService.getSongList(song).subscribe((list) => {
        if (list.length) {
          this.batchActionsService.insertSong(list[0], isPlay);
        } else {
          this.nzMessageService.create('warning', '无URL');
        }
      });
    }
  }

  onLikeSong(id: string) {
    this.batchActionsService.likeSong(id);
  }

  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt('歌曲', resource.name, resource.ar);
    this.store$.dispatch(SetShareInfo({ info: { id: resource.id.toString(), type, txt } }));
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map((item) => item.name).join('/');
    return `${type}: ${name} -- ${makeByStr}`;
  }
}
