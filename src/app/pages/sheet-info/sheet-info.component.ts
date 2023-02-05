import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SetShareInfo } from 'src/app/store/actions/member.action';
import { PlayState } from 'src/app/store/reducers/player.reducer';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { Singer, Song, SongSheet } from '../../services/data.types/common.types';
import { MemberService } from '../../services/member.service';
import { SongService } from '../../services/song.service';
import { BatchActionsService } from '../../store/batch-actions.service';
import { AppStoreModule } from '../../store/index';
import { getCurrentSong } from '../../store/selectors/play.selectors';
import { findIndex } from '../../utils/array';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit, OnDestroy {
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
  private destroy$ = new Subject<void>();
  currentIndex: number = -1;

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songService: SongService,
    private batchActionsService: BatchActionsService,
    private memberService: MemberService,
    private nzMessageService: NzMessageService
  ) {
    this.route.data.pipe(map((res) => res.sheetInfo)).subscribe((res) => {
      this.sheetInfo = res;
      if (res.description) {
        this.changeDesc(res.description);
      }
      this.listenCurrent();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
          this.currentIndex = findIndex(this.sheetInfo.tracks, song);
        } else {
          this.currentIndex = -1;
        }
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
      txt = this.makeTxt('歌单', resource.name, (<SongSheet>resource).creator.nickname);
    } else {
      txt = this.makeTxt('歌曲', resource.name, (<Song>resource).ar);
    }
    this.store$.dispatch(SetShareInfo({ info: { id: resource.id.toString(), type, txt } }));
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
