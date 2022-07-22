import { Action, createReducer, on } from '@ngrx/store';
import { Song } from 'src/app/services/data.types/common.types';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';
import {
  SetIsPlaying,
  SetPlayList,
  SetPlayMode,
  SetSongList,
  SetCurrentIndex
} from '../actions/player.action';

export type PlayState = {
  isPlaying: boolean;
  playMode: PlayMode;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
};

export const initialState: PlayState = {
  isPlaying: false,
  songList: [],
  playList: [],
  playMode: { type: 'loop', label: 'loop' },
  currentIndex: -1
};

const reducer = createReducer(
  initialState,
  on(SetIsPlaying, (state, { isPlaying }) => ({ ...state, isPlaying })),
  on(SetPlayList, (state, { playList }) => ({ ...state, playList })),
  on(SetPlayMode, (state, { playMode }) => ({ ...state, playMode })),
  on(SetSongList, (state, { songList }) => ({ ...state, songList })),
  on(SetCurrentIndex, (state, { currentIndex }) => ({ ...state, currentIndex }))
);

export function playerReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}
