import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { WyCodeComponent } from './wy-code/wy-code.component';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit,
    Output, SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzButtonModule, WyCodeComponent],
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['./wy-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCheckCodeComponent implements OnInit, OnChanges {
  lanRes: LanguageRes = LANGUAGE_JP;
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
    // 登録
    if (this.formModel.valid && this.codePass) {
      this.onCheckExist.emit();
    }
  }
}
