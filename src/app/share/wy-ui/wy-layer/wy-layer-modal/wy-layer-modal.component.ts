import { MemberState } from 'src/app/store/reducers/member.reducer';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { AppStoreModule } from '../../../../store/index';
import { getModalVisible } from '../../../../store/selectors/member.selectors';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModalComponent implements OnInit {
  constructor(private store$: Store<AppStoreModule>) {
    const appStore$ = this.store$.pipe(select(createFeatureSelector<MemberState>('member')));
    appStore$.pipe(select(getModalVisible)).subscribe((vis) => {
      console.log('vis', vis);
    });
  }

  ngOnInit() {}
}
