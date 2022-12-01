import { Song } from 'src/app/services/data.types/common.types';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';

import { createAction, props } from '@ngrx/store';

import { CurrentActions } from '../reducers/player.reducer';

export const SetIsPlaying = createAction('[player] Set isPlaying', props<{ isPlaying: boolean }>());

export const SetPlayMode = createAction('[player] Set playMode', props<{ playMode: PlayMode }>());

export const SetSongList = createAction('[player] Set songList', props<{ songList: Song[] }>());

export const SetPlayList = createAction('[player] Set playList', props<{ playList: Song[] }>());

export const SetCurrentIndex = createAction(
  '[player] Set currentIndex',
  props<{ currentIndex: number }>()
);

export const SetCurrentAction = createAction(
  '[player] Set currentAction',
  props<{ currentAction: CurrentActions }>()
);
