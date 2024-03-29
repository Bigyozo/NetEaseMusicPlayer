import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { ShareParams } from 'src/app/services/member.service';
import { ShareInfo } from 'src/app/store/reducers/member.reducer';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit,
    Output, SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

const MAX_MSG = 140;
@Component({
  selector: 'app-wy-layer-share',
  templateUrl: './wy-layer-share.component.html',
  styleUrls: ['./wy-layer-share.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerShareComponent implements OnInit, OnChanges {
  lanRes: LanguageRes = LANGUAGE_CH;
  @Input() shareInfo: ShareInfo;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onShare = new EventEmitter<ShareParams>();
  @Input() visible = false;
  formModel: FormGroup;
  surplusMsgCount = MAX_MSG;
  constructor(private cdr: ChangeDetectorRef, private languageService: LanguageService) {
    this.formModel = new FormGroup({
      msg: new FormControl('', Validators.maxLength(MAX_MSG))
    });
    this.formModel.get('msg').valueChanges.subscribe((msg) => {
      this.surplusMsgCount = MAX_MSG - msg.length;
    });
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const visible = changes.visible;
    if (visible && !visible.firstChange) {
      this.formModel.get('msg').markAsTouched();
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.formModel.valid) {
      this.onShare.emit({
        id: this.shareInfo.id,
        msg: this.formModel.get('msg').value,
        type: this.shareInfo.type
      });
    }
  }
}
