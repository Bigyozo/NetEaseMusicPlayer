import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { ShareParams } from 'src/app/services/member.service';
import { ShareInfo } from 'src/app/store/member-store.service';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect, input, output
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

const MAX_MSG = 140;
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  selector: 'app-wy-layer-share',
  templateUrl: './wy-layer-share.component.html',
  styleUrls: ['./wy-layer-share.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerShareComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  shareInfo = input.required<ShareInfo>();
  onCancel = output<void>();
  onShare = output<ShareParams>();
  visible = input(false);
  formModel: FormGroup;
  surplusMsgCount = MAX_MSG;
  private visibleFirstRun = true;
  constructor(private cdr: ChangeDetectorRef, private languageService: LanguageService) {
    this.formModel = new FormGroup({
      msg: new FormControl('', Validators.maxLength(MAX_MSG))
    });
    this.formModel.get('msg').valueChanges.subscribe((msg) => {
      this.surplusMsgCount = MAX_MSG - msg.length;
    });
    effect(() => {
      this.lanRes = this.languageService.language().res;
      this.cdr.markForCheck();
    });
    effect(() => {
      this.visible();
      if (this.visibleFirstRun) { this.visibleFirstRun = false; return; }
      this.formModel.get('msg').markAsTouched();
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.formModel.valid) {
      this.onShare.emit({
        id: this.shareInfo().id,
        msg: this.formModel.get('msg').value,
        type: this.shareInfo().type
      });
    }
  }
}
