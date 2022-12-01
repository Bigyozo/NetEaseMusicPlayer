import { NzModalService } from 'ng-zorro-antd';
import { timer } from 'rxjs';
import { Song } from 'src/app/services/data.types/common.types';
import { AppStoreModule } from 'src/app/store';
import {
    SetCurrentAction, SetCurrentIndex, SetPlayList, SetPlayMode
} from 'src/app/store/actions/player.action';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import {
    getCurrentIndex, getCurrentSong, getPlayList, getPlayMode, getSongList
} from 'src/app/store/selectors/play.selectors';
import { findIndex, shuffle } from 'src/app/utils/array';

import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { BatchActionsService } from '../../../store/batch-actions.service';
import { CurrentActions } from '../../../store/reducers/player.reducer';
import { getCurrentAction } from '../../../store/selectors/play.selectors';
import { PlayMode, StateArrType } from './player-types';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';

const modeTypes: PlayMode[] = [
  { type: 'loop', label: 'loop' },
  { type: 'random', label: 'random' },
  { type: 'singleLoop', label: 'singleLoop' }
];

enum TipTitles {
  Add = '已添加到列表',
  Play = '已开始播放'
}
@Component({
  selector: 'app-wy-player',
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
  controlTooltip = {
    title: '',
    show: false
  };
  showPlayer = 'hide';
  isLocked = false;
  //是否正在动画
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

  volume = 10;

  //是否显示音量面板
  showVolumePanel = false;
  showListPanel = false;
  //是否绑定Clickoutside
  bindFlag = false;

  currentMode: PlayMode;

  modeCount = 0;

  //private winClick: Subscription;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;
  @ViewChild(WyPlayerPanelComponent, { static: false })
  private playerPanel: WyPlayerPanelComponent;

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document,
    private nzModalService: NzModalService,
    private batchActionsService: BatchActionsService,
    private router: Router
  ) {
    const appstore$ = this.store$.pipe(select(createFeatureSelector<PlayState>('player')));

    const stateArr: StateArrType[] = [
      {
        type: getPlayMode,
        cb: (mode) => this.watchPlayMode(mode)
      },
      {
        type: getSongList,
        cb: (list) => this.watchList(list, 'songList')
      },
      {
        type: getPlayList,
        cb: (list) => this.watchList(list, 'playList')
      },
      {
        type: getCurrentIndex,
        cb: (index) => this.watchCurrentIndex(index)
      },
      {
        type: getCurrentSong,
        cb: (song) => this.watchCurrentSong(song)
      },
      {
        type: getCurrentAction,
        cb: (currentAction) => this.watchCurrentAction(currentAction)
      }
    ];

    stateArr.forEach((item) => {
      appstore$.pipe(select(item.type)).subscribe(item.cb);
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
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Other }));
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
      this.store$.dispatch(SetPlayList({ playList: list }));
    }
  }

  private updateCurrentIndex(list: Song[], currentSong: Song) {
    const newIndex = findIndex(list, currentSong);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchCurrentSong(song: Song) {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
    }
  }

  //播放，暂停
  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 }));
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
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index < 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  OnNext(index: number) {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }

  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
    if (this.playerPanel) {
      this.playerPanel.seekLyric(0);
    }
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
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
    this.store$.dispatch(SetPlayMode({ playMode: modeTypes[++this.modeCount % 3] }));
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
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
    this.sliderValue = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferOffset < 100) {
      this.bufferOffset = (buffered.end(0) / this.duration) * 100;
    }
  }

  //控制音量面板
  toggleVolPanel() {
    this.togglePanel('showVolumePanel');
  }

  //控制音量面板
  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel('showListPanel');
    }
  }

  togglePanel(type: string) {
    this[type] = !this[type];
    this.bindFlag = this.showVolumePanel || this.showListPanel;
  }

  // private bindDocumentClickListener() {
  //   if (!this.winClick) {
  //     this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
  //       if (!this.selfClick) {
  //         this.showVolumePanel = false;
  //         this.showListPanel = false;
  //         this.unbindDocumentClickListener();
  //       }
  //       this.selfClick = false;
  //     });
  //   }
  // }

  // private unbindDocumentClickListener() {
  //   if (this.winClick) {
  //     this.winClick.unsubscribe();
  //     this.winClick = null;
  //   }
  // }

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
      nzTitle: '确认清空列表？',
      nzOnOk: () => {
        this.batchActionsService.clearSong();
      }
    });
  }

  onClickOutside() {
    this.showVolumePanel = false;
    this.showListPanel = false;
    this.bindFlag = false;
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
}
