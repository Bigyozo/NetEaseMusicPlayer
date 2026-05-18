import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';
import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageRes, Singer, Song } from 'src/app/services/data.types/common.types';
import { RecordVal, User, UserSheet } from 'src/app/services/data.types/member.type';
import { LanguageService } from 'src/app/services/language.service';
import { MemberService, RecordType } from 'src/app/services/member.service';
import { SheetService } from 'src/app/services/sheet.service';
import { SongService } from 'src/app/services/song.service';
import { AppStoreModule } from 'src/app/store';
import { SetShareInfo } from 'src/app/store/actions/member.action';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { getCurrentSong } from 'src/app/store/selectors/play.selectors';
import { findIndex } from 'src/app/utils/array';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { PlayState } from '../../../store/reducers/player.reducer';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CenterComponent implements OnInit, OnDestroy {
  lanRes: LanguageRes = LANGUAGE_CH;
  user: User;
  records: RecordVal[];
  userSheet: UserSheet;
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
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService
  ) {
    this.route.data.pipe(map((res) => res.user)).subscribe(([user, userRecord, userSheet]) => {
      this.user = user;
      this.records = userRecord.slice(0, 10);
      this.userSheet = userSheet;
      this.listenCurrentSong();
    });
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
      this.cdr.markForCheck();
    });
  }

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

  ngOnInit() {}

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
          this.records = records.slice(0, 10);
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
          //无URL
          this.nzMessageService.create('warning', this.lanRes.C00085);
        }
      });
    }
  }

  onShareSong(resource: Song, type = 'song') {
    //歌曲
    const txt = this.makeTxt(this.lanRes.C00046, resource.name, resource.ar);
    this.store$.dispatch(SetShareInfo({ info: { id: resource.id.toString(), type, txt } }));
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map((item) => item.name).join('/');
    return `${type}: ${name} -- ${makeByStr}`;
  }

  onLikeSong(id: string) {
    this.batchActionsService.likeSong(id);
  }
}
