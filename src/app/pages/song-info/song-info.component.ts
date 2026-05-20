import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';
import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes, Singer, Song } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { MemberStoreService } from 'src/app/store/member-store.service';
import { PlayerStoreService } from 'src/app/store/player-store.service';

import { Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ImgDefaultDirective } from '../../share/directives/img-default.directive';

import { BaseLyricLine, WyLyric } from '../../share/wy-ui/wy-player/wy-player-panel/wy-lyric';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NzButtonModule, NzIconModule, ImgDefaultDirective],
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  song: Song;
  lyric: BaseLyricLine[];
  currentSong: Song;
  controlLyric = {
    isExpand: false,
    label: '展開',
    iconCls: 'down'
  };
  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private playerStore: PlayerStoreService,
    private memberStore: MemberStoreService,
    private batchActionsService: BatchActionsService,
    private nzMessageService: NzMessageService,
    private languageService: LanguageService
  ) {
    this.route.data.pipe(map((res) => res.songInfo)).subscribe(([song, lryic]) => {
      this.song = song;
      this.lyric = new WyLyric(lryic).lines;
    });
    effect(() => {
      this.currentSong = this.playerStore.currentSong();
    });
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
    });
  }

  ngOnInit() {}

  toggleLyric() {
    this.controlLyric.isExpand = !this.controlLyric.isExpand;
    if (this.controlLyric.isExpand) {
      this.controlLyric.label = '收起';
      this.controlLyric.iconCls = 'up';
    } else {
      this.controlLyric.label = '展開';
      this.controlLyric.iconCls = 'down';
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
