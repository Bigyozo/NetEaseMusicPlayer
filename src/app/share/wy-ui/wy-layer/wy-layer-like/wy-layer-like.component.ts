import { SongSheet } from 'src/app/services/data.types/common.types';
import { AppStoreModule } from 'src/app/store';
import { MemberState } from 'src/app/store/reducers/member.reducer';
import { getLikeId } from 'src/app/store/selectors/member.selectors';

import {
    ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges
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
  private likeId: string;

  constructor(private store$: Store<AppStoreModule>) {
    this.store$
      .pipe(select(createFeatureSelector<MemberState>('member')), select(getLikeId))
      .subscribe((id) => {
        if (id) {
          this.likeId = id;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('mysheet', changes['mySheets'].currentValue);
  }

  ngOnInit() {}

  onLike(id: string) {}
}
