import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';
import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes, Singer, Song } from 'src/app/services/data.types/common.types';
import { RecordVal, User, UserSheet } from 'src/app/services/data.types/member.type';
import { LanguageService } from 'src/app/services/language.service';
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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImgDefaultDirective } from '../../../share/directives/img-default.directive';
import { SingleSheetComponent } from '../../../share/wy-ui/single-sheet/single-sheet.component';
import { RecordsComponent } from '../components/records/records.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ImgDefaultDirective, SingleSheetComponent, RecordsComponent],
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CenterComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  user: User;
  records: RecordVal[];
  userSheet: UserSheet;
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
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService
  ) {
    this.route.data.pipe(map((res) => res.user)).subscribe(([user, userRecord, userSheet]) => {
      this.user = user;
      this.records = userRecord.slice(0, 10);
      this.userSheet = userSheet;
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
    effect(() => {
      this.lanRes = this.languageService.language().res;
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
          this.nzMessageService.create('warning', this.lanRes.C00085);
        }
      });
    }
  }

  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt(this.lanRes.C00046, resource.name, resource.ar);
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
