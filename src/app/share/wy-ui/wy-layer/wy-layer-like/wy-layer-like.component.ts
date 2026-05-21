import { timer } from 'rxjs';
import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes, SongSheet } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { LikeSongParams } from 'src/app/services/member.service';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect, input, output
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzListModule, NzFormModule, NzIconModule, NzInputModule, NzButtonModule],
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  mySheets = input.required<SongSheet[]>();
  likeId = input.required<string>();
  visible = input.required<boolean>();
  onLikeSong = output<LikeSongParams>();
  onCreateSheet = output<string>();

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
    effect(() => {
      this.lanRes = this.languageService.language().res;
      this.cdr.markForCheck();
    });
    effect(() => {
      if (!this.visible()) {
        timer(500).subscribe(() => {
          this.formModel.get('sheetName').reset();
          this.creating = false;
        });
      }
    });
  }

  ngOnInit() {}

  onLike(pid: string) {
    this.onLikeSong.emit({ pid, tracks: this.likeId() });
  }

  onSubmit() {
    this.onCreateSheet.emit(this.formModel.get('sheetName').value);
  }
}
