import { Injectable, computed, signal } from '@angular/core';

import { Song } from '../services/data.types/common.types';
import { PlayMode } from '../share/wy-ui/wy-player/player-types';

export enum CurrentActions {
  Add,
  Play,
  Delete,
  Clear,
  Other
}

@Injectable({ providedIn: 'root' })
export class PlayerStoreService {
  readonly isPlaying = signal(false);
  readonly playMode = signal<PlayMode>({ type: 'loop', label: 'loop' });
  readonly songList = signal<Song[]>([]);
  readonly playList = signal<Song[]>([]);
  readonly currentIndex = signal(-1);
  readonly currentAction = signal<CurrentActions>(CurrentActions.Other);

  readonly currentSong = computed(() => this.playList()[this.currentIndex()]);
}
