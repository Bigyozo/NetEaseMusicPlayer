import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit,
    Output, SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['./wy-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCheckCodeComponent implements OnInit, OnChanges {
  lanRes: LanguageRes = LANGUAGE_CH;
  private phoneHideStr = '';
  formModel: FormGroup;
  showRepeatBtn = false;
  showErrorTip = false;
  @Input()
  codePass: string | boolean = '';
  @Input()
  timing: number;
  @Output()
  onCheckCode = new EventEmitter<string>();
  @Output()
  onRepeatSendCode = new EventEmitter<void>();
  @Output()
  onCheckExist = new EventEmitter<void>();
  @Input()
  set phone(phone: string) {
    const arr = phone.split('');
    arr.splice(3, 4, '****');
    this.phoneHideStr = arr.join('');
  }

  get phone() {
    return this.phoneHideStr;
  }

  constructor(private languageService: LanguageService, private cdr: ChangeDetectorRef) {
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
      this.cdr.markForCheck();
    });
    this.formModel = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.pattern(/\d{4}/)])
    });
    const codeControl = this.formModel.get('code');
    codeControl.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.onCheckCode.emit(this.formModel.value.code);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.timing) {
      this.showRepeatBtn = this.timing <= 0;
    }
    if (changes.codePass && !changes.codePass.firstChange) {
      this.showErrorTip = !this.codePass;
    }
  }

  ngOnInit() {}

  onSubmit() {
    // 注册
    if (this.formModel.valid && this.codePass) {
      this.onCheckExist.emit();
    }
  }
}
