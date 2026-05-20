import { SongSheet } from 'src/app/services/data.types/common.types';
import { ImgDefaultDirective } from '../../directives/img-default.directive';
import { PlayCountPipe } from '../../pipes/play-count.pipe';

import {
    ChangeDetectionStrategy, Component, OnInit, input, output
} from '@angular/core';

@Component({
  standalone: true,
  imports: [ImgDefaultDirective, PlayCountPipe],
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {
  sheet = input.required<SongSheet>();
  onPlay = output<number>();

  constructor() {}

  ngOnInit() {}

  playsheet(evt: MouseEvent, id: number) {
    evt.stopPropagation();
    this.onPlay.emit(id);
  }

  get coverImg(): string {
    return this.sheet().picUrl || this.sheet().coverImgUrl;
  }
}
