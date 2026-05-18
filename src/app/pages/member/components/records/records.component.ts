import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageRes, Song } from 'src/app/services/data.types/common.types';
import { RecordVal } from 'src/app/services/data.types/member.type';
import { LanguageService } from 'src/app/services/language.service';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormatTimePipe } from '../../../../share/pipes/format-time.pipe';

import { RecordType } from '../../../../services/member.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NzTableModule, NzDividerModule, FormatTimePipe],
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordsComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_CH;
  @Input() records: RecordVal[];
  @Input() recordType = RecordType.weekData;
  @Input() listenSongs = 0;
  @Input() currentIndex = -1;
  @Output() onChangeType = new EventEmitter<RecordType>();
  @Output() onAddSong = new EventEmitter<[Song, boolean]>();
  @Output() onLikeSong = new EventEmitter<string>();
  @Output() onShareSong = new EventEmitter<Song>();
  constructor(private languageService: LanguageService, private cdr: ChangeDetectorRef) {
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {}
}
