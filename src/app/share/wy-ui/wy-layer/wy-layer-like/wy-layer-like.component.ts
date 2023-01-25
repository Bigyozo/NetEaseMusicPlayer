import { SongSheet } from 'src/app/services/data.types/common.types';

import {
    ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {
  @Input()
  mySheets: SongSheet[];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('mysheet', changes['mySheets'].currentValue);
  }

  ngOnInit() {}
}
