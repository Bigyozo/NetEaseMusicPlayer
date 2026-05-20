import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';
import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageService } from 'src/app/services/language.service';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { MemberStoreService } from 'src/app/store/member-store.service';
import { PlayerStoreService } from 'src/app/store/player-store.service';
import { findIndex } from 'src/app/utils/array';

import { Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ImgDefaultDirective } from '../../../share/directives/img-default.directive';
import { FormatTimePipe } from '../../../share/pipes/format-time.pipe';

import { LanguageRes, Singer, SingerDetail, Song } from '../../../services/data.types/common.types';
import { MemberService } from '../../../services/member.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NzButtonModule, NzIconModule, NzTableModule, ImgDefaultDirective, FormatTimePipe],
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  singerDetail: SingerDetail;
  currentSong: Song;
  currentIndex = -1;
  simiSingers: Singer[];
  hasLiked = false;

  constructor(
    private route: ActivatedRoute,
    private playerStore: PlayerStoreService,
    private memberStore: MemberStoreService,
    private songService: SongService,
    private batchActionsService: BatchActionsService,
    private nzMessageService: NzMessageService,
    private memberService: MemberService,
    private languageService: LanguageService
  ) {
    this.route.data.pipe(map((res) => res.singerDetail)).subscribe(([detail, simiSingers]) => {
      this.singerDetail = detail;
      this.simiSingers = simiSingers;
    });
    effect(() => {
      const song = this.playerStore.currentSong();
      this.currentSong = song;
      if (song && this.singerDetail) {
        this.currentIndex = findIndex(this.singerDetail.hotSongs, song);
      } else {
        this.currentIndex = -1;
      }
    });
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
    });
  }

  ngOnInit() {}

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

  // まとめてお気に入り
  onLikeSongs(songs: Song[]) {
    const ids = songs.map((item) => item.id).join(',');
    this.onLikeSong(ids);
  }

  onLikeSinger(id: string) {
    let typeInfo = {
      type: 1,
      msg: '收藏'
    };
    if (this.hasLiked) {
      typeInfo = {
        type: 2,
        msg: '取消收藏'
      };
    }
    this.memberService.likeSinger(id, typeInfo.type).subscribe(
      () => {
        this.hasLiked = !this.hasLiked;
        this.nzMessageService.create('success', typeInfo.msg + '成功');
      },
      (error) => {
        this.nzMessageService.create('error', error.msg || typeInfo.msg + '失败');
      }
    );
  }

  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt('歌曲', resource.name, resource.ar);
    this.memberStore.shareInfo.set({ id: resource.id.toString(), type, txt });
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map((item) => item.name).join('/');
    return `${type}: ${name} -- ${makeByStr}`;
  }
}
