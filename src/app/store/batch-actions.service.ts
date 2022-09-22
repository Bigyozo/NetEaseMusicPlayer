import { PlayState } from 'src/app/store/reducers/player.reducer';

import { Injectable } from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { Song } from '../services/data.types/common.types';
import { findIndex, shuffle } from '../utils/array';
import { SetCurrentIndex, SetPlayList, SetSongList } from './actions/player.action';
import { AppStoreModule } from './index';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {
  playState: PlayState;

  constructor(private store$: Store<AppStoreModule>) {
    this.store$
      .pipe(select(createFeatureSelector<PlayState>('player')))
      .subscribe((res) => (this.playState = res));
  }

  // 播放列表
  selectPlayList({ list, index }: { list: Song[]; index: number }) {
    this.store$.dispatch(SetSongList({ songList: list }));
    let trueIndex = index;
    let trueList = list.slice();
    if (this.playState.playMode.type === 'random') {
      trueList = shuffle(list || []);
      trueIndex = findIndex(trueList, list[trueIndex]);
    }
    this.store$.dispatch(SetPlayList({ playList: trueList }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex }));
  }

  //删除歌曲
  deleteSong(song: Song) {
    const songList = this.playState.songList.slice();
    const playList = this.playState.playList.slice();
    let currentIndex = this.playState.currentIndex;
    const sIndex = findIndex(songList, song);
    songList.splice(sIndex, 1);
    const pIndex = findIndex(playList, song);
    playList.splice(pIndex, 1);
    if (currentIndex > pIndex || currentIndex === playList.length) {
      currentIndex--;
    }
    this.store$.dispatch(SetSongList({ songList }));
    this.store$.dispatch(SetPlayList({ playList }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex }));
  }

  //清空歌曲列表
  clearSong() {
    this.store$.dispatch(SetSongList({ songList: [] }));
    this.store$.dispatch(SetPlayList({ playList: [] }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex: -1 }));
  }
}
