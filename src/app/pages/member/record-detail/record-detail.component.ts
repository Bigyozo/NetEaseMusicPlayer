import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Song } from 'src/app/services/data.types/common.types';
import { RecordVal, User } from 'src/app/services/data.types/member.type';
import { MemberService, RecordType } from 'src/app/services/member.service';
import { SheetService } from 'src/app/services/sheet.service';
import { SongService } from 'src/app/services/song.service';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { getCurrentSong } from 'src/app/store/selectors/play.selectors';
import { findIndex } from 'src/app/utils/array';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createFeatureSelector, select, Store } from '@ngrx/store';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styles: [
    `
      .record-detail .page-wrap {
        padding: 40px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailComponent implements OnInit, OnDestroy {
  user: User;
  records: RecordVal[];
  recordType = RecordType.weekData;
  private currentSong: Song;
  currentIndex = -1;
  private destory$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private batchActionsService: BatchActionsService,
    private memberService: MemberService,
    private songService: SongService,
    private nzMessageService: NzMessageService,
    private store$: Store<AppStoreModule>,
    private cdr: ChangeDetectorRef
  ) {
    this.route.data.pipe(map((res) => res.user)).subscribe(([user, userRecord]) => {
      this.user = user;
      this.records = userRecord;
      this.listenCurrentSong();
    });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  private listenCurrentSong() {
    this.store$
      .pipe(
        select(createFeatureSelector<PlayState>('player')),
        select(getCurrentSong),
        takeUntil(this.destory$)
      )
      .subscribe((song) => {
        this.currentSong = song;
        if (song) {
          const songs = this.records.map((item) => item.song);
          this.currentIndex = findIndex(songs, song);
        } else {
          this.currentIndex = -1;
        }
        this.cdr.markForCheck();
      });
  }

  onPlaySheet(id: number) {
    this.sheetService.playsheet(id).subscribe((list) => {
      this.batchActionsService.selectPlayList({ list, index: 0 });
    });
  }

  onChangeType(type: RecordType) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberService
        .getUserRecord(this.user.profile.userId.toString(), type)
        .subscribe((records) => {
          this.records = records;
          this.cdr.markForCheck();
        });
    }
  }

  onAddSong([song, isPlay]) {
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
