import { CurrentActions, PlayState } from 'src/app/store/reducers/player.reducer';

import { Injectable } from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { Song } from '../services/data.types/common.types';
import { findIndex, shuffle } from '../utils/array';
import { SetLikeId, SetModalType, SetModalVisible } from './actions/member.action';
import {
    SetCurrentAction, SetCurrentIndex, SetPlayList, SetSongList
} from './actions/player.action';
import { AppStoreModule } from './index';
import { MemberState, ModalTypes } from './reducers/member.reducer';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {
  playState: PlayState;
  memberState: MemberState;

  constructor(private store$: Store<AppStoreModule>) {
    this.store$
      .pipe(select(createFeatureSelector<PlayState>('player')))
      .subscribe((res) => (this.playState = res));
    this.store$
      .pipe(select(createFeatureSelector<MemberState>('member')))
      .subscribe((res) => (this.memberState = res));
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
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Play }));
  }

  //添加歌曲
  insertSong(song: Song, isPlay: boolean) {
    const songList = this.playState.songList.slice();
    const playList = this.playState.playList.slice();
    let insertIndex = this.playState.currentIndex;
    const pIndex = findIndex(playList, song);
    if (pIndex > -1) {
      if (isPlay) {
        insertIndex = pIndex;
      }
    } else {
      songList.push(song);
      playList.push(song);
      if (isPlay) {
        insertIndex = songList.length - 1;
      }
      this.store$.dispatch(SetSongList({ songList }));
      this.store$.dispatch(SetPlayList({ playList }));
    }
    if (insertIndex !== this.playState.currentIndex) {
      this.store$.dispatch(SetCurrentIndex({ currentIndex: insertIndex }));
      this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Play }));
    } else {
      this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Add }));
    }
  }

  insertSongs(songs: Song[]) {
    const songList = this.playState.songList.slice();
    const playList = this.playState.playList.slice();
    songs.forEach((element) => {
      const pIndex = findIndex(playList, element);
      if (pIndex === -1) {
        songList.push(element);
        playList.push(element);
      }
    });
    this.store$.dispatch(SetSongList({ songList }));
    this.store$.dispatch(SetPlayList({ playList }));
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Add }));
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
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Delete }));
  }

  //清空歌曲列表
  clearSong() {
    this.store$.dispatch(SetSongList({ songList: [] }));
    this.store$.dispatch(SetPlayList({ playList: [] }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex: -1 }));
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Clear }));
  }

  //会员弹窗显示隐藏/类型
  controlModal(modalVisible = true, modalType?: ModalTypes) {
    if (modalType) {
      this.store$.dispatch(SetModalType({ modalType }));
    }
    this.store$.dispatch(SetModalVisible({ modalVisible }));
  }

  //收藏歌曲
  likeSong(id: string) {
    this.store$.dispatch(SetModalType({ modalType: ModalTypes.Like }));
    this.store$.dispatch(SetLikeId({ likeId: id }));
  }
}
