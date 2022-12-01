import { Song } from 'src/app/services/data.types/common.types';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';

import { Action, createReducer, on } from '@ngrx/store';

import {
    SetCurrentAction, SetCurrentIndex, SetIsPlaying, SetPlayList, SetPlayMode, SetSongList
} from '../actions/player.action';

export enum CurrentActions {
  Add,
  Play,
  Delete,
  Clear,
  Other
}

export type PlayState = {
  isPlaying: boolean;
  playMode: PlayMode;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  //当前操作
  currentAction: CurrentActions;
};

export const initialState: PlayState = {
  isPlaying: false,
  songList: [],
  playList: [],
  playMode: { type: 'loop', label: 'loop' },
  currentIndex: -1,
  currentAction: CurrentActions.Other
};

const reducer = createReducer(
  initialState,
  on(SetIsPlaying, (state, { isPlaying }) => ({ ...state, isPlaying })),
  on(SetPlayList, (state, { playList }) => ({ ...state, playList })),
  on(SetPlayMode, (state, { playMode }) => ({ ...state, playMode })),
  on(SetSongList, (state, { songList }) => ({ ...state, songList })),
  on(SetCurrentIndex, (state, { currentIndex }) => ({ ...state, currentIndex })),
  on(SetCurrentAction, (state, { currentAction }) => ({ ...state, currentAction }))
);

export function playerReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}
