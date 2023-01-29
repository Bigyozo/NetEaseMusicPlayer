import { SongSheet } from 'src/app/services/data.types/common.types';
import { LikeSongParams } from 'src/app/services/member.service';
import { AppStoreModule } from 'src/app/store';
import { MemberState } from 'src/app/store/reducers/member.reducer';
import { getLikeId } from 'src/app/store/selectors/member.selectors';

import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output,
    SimpleChanges
} from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {
  @Input()
  mySheets: SongSheet[];
  @Input()
  likeId: string;
  @Output()
  onLikeSong = new EventEmitter<LikeSongParams>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mySheets']) {
      console.log('mysheet', changes['mySheets']);
    }
    if (changes['likeId']) {
      console.log('likeId', changes['likeId']);
    }
  }

  ngOnInit() {}

  onLike(pid: string) {
    this.onLikeSong.emit({ pid, tracks: this.likeId });
  }
}
