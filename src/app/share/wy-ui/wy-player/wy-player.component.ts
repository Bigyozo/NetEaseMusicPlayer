import { NzModalService } from 'ng-zorro-antd/modal';
import { timer } from 'rxjs';
import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes, Singer, Song } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { findIndex, shuffle } from 'src/app/utils/array';

import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { BatchActionsService } from '../../../store/batch-actions.service';
import { CurrentActions, PlayerStoreService } from '../../../store/player-store.service';
import { MemberStoreService } from '../../../store/member-store.service';
import { PlayMode, StateArrType } from './player-types';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { WySliderComponent } from '../wy-slider/wy-slider.component';
import { FormatTimePipe } from '../../pipes/format-time.pipe';
import { ClickoutsideDirective } from '../../directives/clickoutside.directive';
import { ImgDefaultDirective } from '../../directives/img-default.directive';

const modeTypes: PlayMode[] = [
  { type: 'loop', label: 'loop' },
  { type: 'random', label: 'random' },
  { type: 'singleLoop', label: 'singleLoop' }
];

enum TipTitles {
  Add = '已添加到列表',
  Play = '已開始播放'
}
@Component({
  selector: 'app-wy-player',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzIconModule,
    NzModalModule,
    NzTooltipModule,
    WySliderComponent,
    WyPlayerPanelComponent,
    FormatTimePipe,
    ClickoutsideDirective,
    ImgDefaultDirective
  ],
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
  animations: [
    trigger('showHide', [
      state('show', style({ bottom: 0 })),
      state('hide', style({ bottom: -71 })),
      transition('show=>hide', [animate('0.3s')]),
      transition('hide=>show', [animate('0.1s')])
    ])
  ]
})
export class WyPlayerComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  controlTooltip = {
    title: '',
    show: false
  };
  showPlayer = 'hide';
  isLocked = false;
  isAnimating = false;

  sliderValue = 0;
  bufferOffset = 0;

  playMode: PlayMode;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;

  duration: number;
  currentTime: number;

  isPlaying = false;
  songReady = false;

  volume = 7;

  showVolumePanel = false;
  showListPanel = false;
  bindFlag = false;

  currentMode: PlayMode;
  modeCount = 0;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;
  @ViewChild(WyPlayerPanelComponent, { static: false })
  private playerPanel: WyPlayerPanelComponent;

  constructor(
    private playerStore: PlayerStoreService,
    private memberStore: MemberStoreService,
    private nzModalService: NzModalService,
    private batchActionsService: BatchActionsService,
    private router: Router,
    private languageService: LanguageService
  ) {
    effect(() => this.watchPlayMode(this.playerStore.playMode()));
    effect(() => this.watchList(this.playerStore.songList(), 'songList'));
    effect(() => this.watchList(this.playerStore.playList(), 'playList'));
    effect(() => this.watchCurrentIndex(this.playerStore.currentIndex()));
    effect(() => this.watchCurrentSong(this.playerStore.currentSong()));
    effect(() => this.watchCurrentAction(this.playerStore.currentAction()));

    effect(() => {
      this.lanRes = this.languageService.language().res;
    });
  }

  private watchCurrentAction(currentAction: CurrentActions) {
    const title = TipTitles[CurrentActions[currentAction]];
    if (title) {
      this.controlTooltip.title = title;
      if (this.showPlayer === 'hide') {
        this.togglePlayer('show');
      } else {
        this.showToolTip();
      }
    }
    this.playerStore.currentAction.set(CurrentActions.Other);
  }

  private showToolTip() {
    this.controlTooltip.show = true;
    timer(1500).subscribe(() => {
      this.controlTooltip = {
        title: '',
        show: false
      };
    });
  }

  onAnimateDone(event: AnimationEvent) {
    this.isAnimating = false;
    if (event.toState === 'show' && this.controlTooltip.title) {
      this.showToolTip();
    }
  }

  private watchPlayMode(mode: PlayMode) {
    this.playMode = mode;
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
      }
      this.updateCurrentIndex(list, this.currentSong);
      this.playerStore.playList.set(list);
    }
  }

  private updateCurrentIndex(list: Song[], currentSong: Song) {
    const newIndex = findIndex(list, currentSong);
    this.playerStore.currentIndex.set(newIndex);
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchCurrentSong(song: Song) {
    this.currentSong = song;
    if (song) {
      this.duration = song.dt / 1000;
    }
  }

  // 再生・一時停止
  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.playerStore.currentIndex.set(0);
        this.songReady = false;
      }
    } else {
      if (this.songReady) {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    }
  }

  OnPrev(index: number) {
    if (!this.songReady) {
      return;
    }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index < 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  OnNext(index: number) {
    if (!this.songReady) {
      return;
    }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }

  // 再生エラー（楽曲なし）
  onError() {
    this.isPlaying = false;
    this.bufferOffset = 0;
  }

  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
    if (this.playerPanel) {
      this.playerPanel.seekLyric(0);
    }
  }

  private updateIndex(index: number) {
    this.playerStore.currentIndex.set(index);
    this.songReady = false;
  }

  OnPercentChange(per: number) {
    if (this.currentSong) {
      const currentTime = this.duration * (per / 100);
      this.audioEl.currentTime = currentTime;
      if (this.playerPanel) {
        this.playerPanel.seekLyric(currentTime * 1000);
      }
    }
  }

  onVolumeChange(per: number) {
    this.audioEl.volume = per / 100;
  }

  changeMode() {
    this.playerStore.playMode.set(modeTypes[++this.modeCount % 3]);
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }

  onCanplay() {
    this.songReady = true;
    this.play();
  }

  onEnded() {
    this.isPlaying = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.OnNext(this.currentIndex + 1);
    }
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime;
    this.sliderValue = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferOffset < 100) {
      this.bufferOffset = (buffered.end(0) / this.duration) * 100;
    }
  }

  toggleVolPanel() {
    this.togglePanel('showVolumePanel');
  }

  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel('showListPanel');
    }
  }

  togglePanel(type: string) {
    this[type] = !this[type];
    this.bindFlag = this.showVolumePanel || this.showListPanel;
  }

  private play() {
    this.audioEl.play();
    this.isPlaying = true;
  }

  get picUrl(): string {
    return this.currentSong
      ? this.currentSong.al.picUrl
      : 'http://p4.music.126.net/li2A386svzMb64rquvjXfg==/3239161259160059.jpg';
  }

  onChangeSong(song: Song): void {
    this.updateCurrentIndex(this.playList, song);
  }

  onDeleteSong(song: Song) {
    this.batchActionsService.deleteSong(song);
  }

  onClearSong() {
    this.nzModalService.confirm({
      nzTitle: this.lanRes.C00084,
      nzOnOk: () => {
        this.batchActionsService.clearSong();
      }
    });
  }

  onClickOutside(target: HTMLElement) {
    if (target.dataset.act !== 'delete') {
      this.showVolumePanel = false;
      this.showListPanel = false;
      this.bindFlag = false;
    }
  }

  toInfo(path: [string, number]) {
    if (path[1]) {
      this.showVolumePanel = false;
      this.showListPanel = false;
      this.router.navigate(path);
    }
  }

  togglePlayer(type: string) {
    if (!this.isLocked && !this.isAnimating) {
      this.showPlayer = type;
    }
  }

  onLikeSong(id: string) {
    this.batchActionsService.likeSong(id);
  }

  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt(this.lanRes.C00046, resource.name, resource.ar);
    this.memberStore.shareInfo.set({ id: resource.id.toString(), type, txt });
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map((item) => item.name).join('/');
    return `${type}: ${name} -- ${makeByStr}`;
  }
}
