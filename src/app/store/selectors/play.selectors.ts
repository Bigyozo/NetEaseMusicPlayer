import { createSelector } from '@ngrx/store';
import { PlayState } from '../reducers/player.reducer';

const selectPlayerStates = (state: PlayState) => state;

export const getIsPlaying = createSelector(
  selectPlayerStates,
  (state: PlayState) => state.isPlaying
);
export const getPlayMode = createSelector(
  selectPlayerStates,
  (state: PlayState) => state.playMode
);
export const getSongList = createSelector(
  selectPlayerStates,
  (state: PlayState) => state.playList
);
export const getPlayList = createSelector(
  selectPlayerStates,
  (state: PlayState) => state.songList
);
export const getCurrentIndex = createSelector(
  selectPlayerStates,
  (state: PlayState) => state.currentIndex
);

export const getCurrentSong = createSelector(
  selectPlayerStates,
  ({ playList, currentIndex }: PlayState) => playList[currentIndex]
);
