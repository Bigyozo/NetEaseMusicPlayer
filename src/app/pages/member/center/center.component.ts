import { NzMessageService } from 'ng-zorro-antd';
import { map } from 'rxjs/internal/operators';
import { Song } from 'src/app/services/data.types/common.types';
import { RecordVal, User, UserSheet } from 'src/app/services/data.types/member.type';
import { MemberService, RecordType } from 'src/app/services/member.service';
import { SheetService } from 'src/app/services/sheet.service';
import { SongService } from 'src/app/services/song.service';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { getCurrentSong } from 'src/app/store/selectors/play.selectors';
import { findIndex } from 'src/app/utils/array';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { PlayState } from '../../../store/reducers/player.reducer';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less']
})
export class CenterComponent implements OnInit {
  user: User;
  records: RecordVal[];
  userSheet: UserSheet;
  recordType = RecordType.weekData;
  private currentSong: Song;
  private currentIndex = -1;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private batchActionsService: BatchActionsService,
    private memberService: MemberService,
    private songService: SongService,
    private batchActionService: BatchActionsService,
    private nzMessageService: NzMessageService,
    private store$: Store<AppStoreModule>
  ) {
    this.route.data.pipe(map((res) => res.user)).subscribe(([user, userRecord, userSheet]) => {
      this.user = user;
      this.records = userRecord.slice(0, 10);
      this.userSheet = userSheet;
      this.listenCurrentSong();
    });
  }

  listenCurrentSong() {
    this.store$
      .pipe(select(createFeatureSelector<PlayState>('player')), select(getCurrentSong))
      .subscribe((song) => {
        this.currentSong = song;
        if (song) {
          const songs = this.records.map((item) => item.song);
          this.currentIndex = findIndex(songs, song);
        } else {
          this.currentIndex = -1;
        }
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
