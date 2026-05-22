import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';
import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageService } from 'src/app/services/language.service';
import { MemberStoreService } from 'src/app/store/member-store.service';
import { PlayerStoreService } from 'src/app/store/player-store.service';

import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ImgDefaultDirective } from '../../share/directives/img-default.directive';
import { FormatTimePipe } from '../../share/pipes/format-time.pipe';

import { LanguageRes, Singer, Song, SongSheet } from '../../services/data.types/common.types';
import { MemberService } from '../../services/member.service';
import { SongService } from '../../services/song.service';
import { BatchActionsService } from '../../store/batch-actions.service';
import { findIndex } from '../../utils/array';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NzButtonModule, NzIconModule, NzTagModule, NzTableModule, ImgDefaultDirective, FormatTimePipe],
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SheetInfoComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  sheetInfo: SongSheet;

  description = {
    short: '',
    long: ''
  };

  controlDesc = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };

  currentSong: Song;
  currentIndex = -1;

  constructor(
    private route: ActivatedRoute,
    private playerStore: PlayerStoreService,
    private memberStore: MemberStoreService,
    private songService: SongService,
    private batchActionsService: BatchActionsService,
    private memberService: MemberService,
    private nzMessageService: NzMessageService,
    private languageService: LanguageService
  ) {
    this.route.data.pipe(map((res) => res.sheetInfo)).subscribe((res) => {
      this.sheetInfo = res;
      if (res.description) {
        this.changeDesc(res.description);
      }
    });
    effect(() => {
      const song = this.playerStore.currentSong();
      this.currentSong = song;
      if (song && this.sheetInfo) {
        this.currentIndex = findIndex(this.sheetInfo.tracks, song);
      } else {
        this.currentIndex = -1;
      }
    });
    effect(() => {
      this.lanRes = this.languageService.language().res;
    });
  }

  private changeDesc(desc: string) {
    desc = '<b>介绍:</b>  ' + desc;
    if (desc.length < 99) {
      this.description = {
        short: this.replaceBr(desc),
        long: ''
      };
    } else {
      this.description = {
        short: this.replaceBr(desc.slice(0, 99)) + '...',
        long: this.replaceBr(desc)
      };
    }
  }

  ngOnInit() {}

  toggleDesc() {
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if (this.controlDesc.isExpand) {
      this.controlDesc.label = '收起';
      this.controlDesc.iconCls = 'up';
    } else {
      this.controlDesc.label = '展开';
      this.controlDesc.iconCls = 'down';
    }
  }

  private replaceBr(str: string): string {
    return str.replace(/\n/g, '<br />');
  }

  onAddSong(song: Song, isPlay: boolean = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songService.getSongList(song).subscribe((list) => {
        if (list.length) {
          this.batchActionsService.insertSong(list[0], isPlay);
        } else {
          this.alertMessage('warning', '无URL');
        }
      });
    }
  }

  onAddSongs(songs: Song[]) {
    this.songService.getSongList(songs).subscribe((list) => {
      if (list.length) {
        this.batchActionsService.insertSongs(list);
      }
    });
  }

  onLikeSong(id: string) {
    this.batchActionsService.likeSong(id);
  }

  onLikeSheet(id: string) {
    this.memberService.likeSheet(id).subscribe(
      () => {
        this.alertMessage('success', '收藏成功');
      },
      (error) => {
        this.alertMessage('error', error.message || 'subscribe fail');
      }
    );
  }

  shareResource(resource: Song | SongSheet, type = 'song') {
    let txt = '';
    if (type === 'playlist') {
      txt = this.makeTxt('歌单', resource.name, (resource as SongSheet).creator.nickname);
    } else {
      txt = this.makeTxt('歌曲', resource.name, (resource as Song).ar);
    }
    this.memberStore.shareInfo.set({ id: resource.id.toString(), type, txt });
  }

  private makeTxt(type: string, name: string, makeBy: string | Singer[]): string {
    let makeByStr = '';
    if (Array.isArray(makeBy)) {
      makeByStr = makeBy.map((item) => item.name).join('/');
    } else {
      makeByStr = makeBy;
    }
    return `${type}: ${name} -- ${makeByStr}`;
  }

  private alertMessage(type: string, msg: string) {
    this.nzMessageService.create(type, msg);
  }
}
