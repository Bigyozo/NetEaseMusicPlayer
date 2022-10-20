import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Song } from 'src/app/services/data.types/common.types';
import { SongService } from 'src/app/services/song.service';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { PlayState } from 'src/app/store/reducers/player.reducer';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { BaseLyricLine, WyLyric } from '../../share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import { getCurrentSong } from '../../store/selectors/play.selectors';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit {
  song: Song;
  lyric: BaseLyricLine[];
  private destroy$ = new Subject<void>();
  currentSong: Song;
  controlLyric = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };
  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private store$: Store<AppStoreModule>,
    private batchActionsService: BatchActionsService,
    private nzMessageService: NzMessageService
  ) {
    this.route.data.pipe(map((res) => res.songInfo)).subscribe(([song, lryic]) => {
      this.song = song;
      this.lyric = new WyLyric(lryic).lines;
      this.listenCurrent();
    });
  }

  ngOnInit() {}

  toggleLyric() {
    this.controlLyric.isExpand = !this.controlLyric.isExpand;
    if (this.controlLyric.isExpand) {
      this.controlLyric.label = '收起';
      this.controlLyric.iconCls = 'up';
    } else {
      this.controlLyric.label = '展开';
      this.controlLyric.iconCls = 'down';
    }
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
      });
  }

  onShareSong() {}

  onLikeSong() {}

  onAddSong(song: Song, isPlay: boolean = false) {
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
}
