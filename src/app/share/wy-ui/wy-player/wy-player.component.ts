import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';
import { Song } from 'src/app/services/data.types/common.types';
import { AppStoreModule } from 'src/app/store';
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

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }

  onCanplay() {
    this.play();
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
  }

  private play() {
    this.audioEl.play();
  }

  get picUrl(): string {
    return this.currentSong
      ? this.currentSong.al.picUrl
      : 'http://p4.music.126.net/li2A386svzMb64rquvjXfg==/3239161259160059.jpg';
  }
}
