import { timer } from 'rxjs';

import { Injectable } from '@angular/core';

import { Song } from '../services/data.types/common.types';
import { findIndex, shuffle } from '../utils/array';
import { CurrentActions, PlayerStoreService } from './player-store.service';
import { MemberStoreService, ModalTypes } from './member-store.service';

@Injectable({
  providedIn: 'root'
})
export class BatchActionsService {
  constructor(
    private playerStore: PlayerStoreService,
    private memberStore: MemberStoreService
  ) {}

  // プレイリスト
  selectPlayList({ list, index }: { list: Song[]; index: number }) {
    this.playerStore.songList.set(list);
    let trueIndex = index;
    let trueList = list.slice();
    if (this.playerStore.playMode().type === 'random') {
      trueList = shuffle(list || []);
      trueIndex = findIndex(trueList, list[trueIndex]);
    }
    this.playerStore.playList.set(trueList);
    this.playerStore.currentIndex.set(trueIndex);
    this.playerStore.currentAction.set(CurrentActions.Play);
  }

  // 楽曲を追加
  insertSong(song: Song, isPlay: boolean) {
    const songList = this.playerStore.songList().slice();
    let playList = this.playerStore.playList().slice();
    let insertIndex = this.playerStore.currentIndex();
    const pIndex = findIndex(playList, song);
    if (pIndex > -1) {
      if (isPlay) {
        insertIndex = pIndex;
      }
    } else {
      songList.push(song);
      if (isPlay) {
        insertIndex = songList.length - 1;
      }
      if (this.playerStore.playMode().type === 'random') {
        playList = shuffle(songList);
      } else {
        playList.push(song);
      }
      this.playerStore.songList.set(songList);
      this.playerStore.playList.set(playList);
    }
    if (insertIndex !== this.playerStore.currentIndex()) {
      this.playerStore.currentIndex.set(insertIndex);
      this.playerStore.currentAction.set(CurrentActions.Play);
    } else {
      this.playerStore.currentAction.set(CurrentActions.Add);
    }
  }

  // 複数の楽曲を追加
  insertSongs(songs: Song[]) {
    let songList = this.playerStore.songList().slice();
    let playList = this.playerStore.playList().slice();
    const validSongs = songs.filter((item) => findIndex(playList, item) === -1);
    if (validSongs.length) {
      songList = songList.concat(validSongs);
      playList = playList.concat(validSongs.slice());
      if (this.playerStore.playMode().type === 'random') {
        playList = shuffle(songList);
      }
      this.playerStore.songList.set(songList);
      this.playerStore.playList.set(playList);
    }
    this.playerStore.currentAction.set(CurrentActions.Add);
  }

  // 楽曲を削除
  deleteSong(song: Song) {
    const songList = this.playerStore.songList().slice();
    const playList = this.playerStore.playList().slice();
    let currentIndex = this.playerStore.currentIndex();
    const sIndex = findIndex(songList, song);
    songList.splice(sIndex, 1);
    const pIndex = findIndex(playList, song);
    playList.splice(pIndex, 1);
    if (currentIndex > pIndex || currentIndex === playList.length) {
      currentIndex--;
    }
    this.playerStore.songList.set(songList);
    this.playerStore.playList.set(playList);
    this.playerStore.currentIndex.set(currentIndex);
    this.playerStore.currentAction.set(CurrentActions.Delete);
  }

  // 曲リストをクリア
  clearSong() {
    this.playerStore.songList.set([]);
    this.playerStore.playList.set([]);
    this.playerStore.currentIndex.set(-1);
    this.playerStore.currentAction.set(CurrentActions.Clear);
  }

  // メンバーモーダルの表示/非表示・タイプ
  controlModal(modalVisible = true, modalType?: ModalTypes) {
    if (modalType) {
      this.memberStore.modalType.set(modalType);
    }
    this.memberStore.modalVisible.set(modalVisible);
    if (!modalVisible) {
      timer(500).subscribe(() => {
        this.memberStore.modalType.set(ModalTypes.Default);
      });
    }
  }

  // 楽曲をお気に入り
  likeSong(id: string) {
    this.memberStore.modalType.set(ModalTypes.Like);
    this.memberStore.likeId.set(id);
  }
}
