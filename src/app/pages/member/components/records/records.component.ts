import { Song } from 'src/app/services/data.types/common.types';
import { RecordVal } from 'src/app/services/data.types/member.type';

import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';

import { RecordType } from '../../../../services/member.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordsComponent implements OnInit {
  @Input() records: RecordVal[];
  @Input() recordType = RecordType.weekData;
  @Input() listenSongs = 0;
  @Input() currentIndex = -1;
  @Output() onChangeType = new EventEmitter<RecordType>();
  @Output() onAddSong = new EventEmitter<[Song, boolean]>();
  constructor() {}

  ngOnInit() {}
}
