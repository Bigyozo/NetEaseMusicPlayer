import { timer } from 'rxjs';
import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageRes, SongSheet } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { LikeSongParams } from 'src/app/services/member.service';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit,
    Output, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {
  lanRes: LanguageRes = LANGUAGE_CH;
  @Input()
  mySheets: SongSheet[];
  @Input()
  likeId: string;
  @Input()
  visible: boolean;
  @Output()
  onLikeSong = new EventEmitter<LikeSongParams>();
  @Output()
  onCreateSheet = new EventEmitter<string>();

  formModel: FormGroup;

  creating = false;
  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
    this.formModel = this.fb.group({
      sheetName: ['', [Validators.required]]
    });
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible) {
      if (!this.visible) {
        timer(500).subscribe(() => {
          this.formModel.get('sheetName').reset();
          this.creating = false;
        });
      }
    }
  }

  ngOnInit() {}

  onLike(pid: string) {
    this.onLikeSong.emit({ pid, tracks: this.likeId });
  }

  onSubmit() {
    this.onCreateSheet.emit(this.formModel.get('sheetName').value);
  }
}
