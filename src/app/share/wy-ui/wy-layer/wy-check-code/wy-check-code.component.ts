import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { WyCodeComponent } from './wy-code/wy-code.component';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, computed, effect, input, output
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
export class WyCheckCodeComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  formModel: FormGroup;
  showRepeatBtn = false;
  showErrorTip = false;
  codePass = input<string | boolean>('');
  timing = input.required<number>();
  onCheckCode = output<string>();
  onRepeatSendCode = output<void>();
  onCheckExist = output<void>();
  phone = input.required<string>();
  readonly phoneHideStr = computed(() => {
    const arr = this.phone().split('');
    arr.splice(3, 4, '****');
    return arr.join('');
  });
  private codePassFirstRun = true;

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
    effect(() => {
      this.showRepeatBtn = this.timing() <= 0;
    });
    effect(() => {
      const cp = this.codePass();
      if (this.codePassFirstRun) { this.codePassFirstRun = false; return; }
      this.showErrorTip = !cp;
    });
  }

  ngOnInit() {}

  onSubmit() {
    // 登録
    if (this.formModel.valid && this.codePass()) {
      this.onCheckExist.emit();
    }
  }
}
