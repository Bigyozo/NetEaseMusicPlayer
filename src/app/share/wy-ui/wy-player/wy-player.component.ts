import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';
import { Song } from 'src/app/services/data.types/common.types';
import { AppStoreModule } from 'src/app/store';
import { SetCurrentIndex } from 'src/app/store/actions/player.action';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import {
  getCurrentIndex,
  getCurrentSong,
  getPlayList,
  getPlayMode,
  getSongList
} from 'src/app/store/selectors/play.selectors';
import { PlayMode, StateArrType } from './player-types';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  sliderValue = 35;
  bufferOffset = 60;

  playMode: PlayMode;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;

  duration: number;
  currentTime: number;

  isPlaying = false;
  songReady = false;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(private store$: Store<AppStoreModule>) {
    const appstore$ = this.store$.pipe(
      select(createFeatureSelector<PlayState>('player'))
    );

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
      }
    ];

    stateArr.forEach((item) => {
      appstore$.pipe(select(item.type)).subscribe(item.cb);
    });
  }

  private watchPlayMode(mode: PlayMode) {
    this.playMode = mode;
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
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }

  onCanplay() {
    this.songReady = true;
    this.play();
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
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
}
