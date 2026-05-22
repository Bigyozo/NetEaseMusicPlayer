import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';
import { Singer, Song } from 'src/app/services/data.types/common.types';
import { RecordVal, User } from 'src/app/services/data.types/member.type';
import { MemberService, RecordType } from 'src/app/services/member.service';
import { SheetService } from 'src/app/services/sheet.service';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { MemberStoreService } from 'src/app/store/member-store.service';
import { PlayerStoreService } from 'src/app/store/player-store.service';
import { findIndex } from 'src/app/utils/array';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecordsComponent } from '../components/records/records.component';

@Component({
  standalone: true,
  imports: [CommonModule, RecordsComponent],
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
export class RecordDetailComponent implements OnInit {
  user: User;
  records: RecordVal[];
  recordType = RecordType.weekData;
  private currentSong: Song;
  currentIndex = -1;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private batchActionsService: BatchActionsService,
    private memberService: MemberService,
    private songService: SongService,
    private nzMessageService: NzMessageService,
    private playerStore: PlayerStoreService,
    private memberStore: MemberStoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.route.data.pipe(map((res) => res.user)).subscribe(([user, userRecord]) => {
      this.user = user;
      this.records = userRecord;
    });
    effect(() => {
      const song = this.playerStore.currentSong();
      this.currentSong = song;
      if (song && this.records) {
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

  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt('歌曲', resource.name, resource.ar);
    this.memberStore.shareInfo.set({ id: resource.id.toString(), type, txt });
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map((item) => item.name).join('/');
    return `${type}: ${name} -- ${makeByStr}`;
  }

  onLikeSong(id: string) {
    this.batchActionsService.likeSong(id);
  }
}
