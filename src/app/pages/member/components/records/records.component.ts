import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes, Song } from 'src/app/services/data.types/common.types';
import { RecordVal } from 'src/app/services/data.types/member.type';
import { LanguageService } from 'src/app/services/language.service';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect, input, output
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
  lanRes: LanguageRes = LANGUAGE_JP;
  records = input.required<RecordVal[]>();
  recordType = input(RecordType.weekData);
  listenSongs = input(0);
  currentIndex = input(-1);
  onChangeType = output<RecordType>();
  onAddSong = output<[Song, boolean]>();
  onLikeSong = output<string>();
  onShareSong = output<Song>();
  constructor(private languageService: LanguageService, private cdr: ChangeDetectorRef) {
    effect(() => {
      this.lanRes = this.languageService.language().res;
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {}
}
