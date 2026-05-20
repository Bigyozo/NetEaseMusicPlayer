import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { PhoneLoginParams } from 'src/app/services/data.types/member.type';
import { LanguageService } from 'src/app/services/language.service';
import { codeJson } from 'src/app/utils/base64';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect, input, output
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzCheckboxModule, NzButtonModule],
  selector: 'app-wy-layer-phoneLogin',
  templateUrl: './wy-layer-phoneLogin.component.html',
  styleUrls: ['./wy-layer-phoneLogin.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerPhoneLoginComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  wyRememberLogin = input.required<PhoneLoginParams>();
  onChangeModalType = output<string | void>();
  onLogin = output<PhoneLoginParams>();
  visible = input(false);
  formModel: FormGroup;
  private visibleFirstRun = true;
  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
      this.cdr.markForCheck();
    });
    effect(() => {
      const params = this.wyRememberLogin();
      let phone = '';
      let password = '';
      let remember = false;
      if (params) {
        const value = codeJson(params, 'decode');
        phone = value.phone;
        password = value.password;
        remember = value.remember;
      }
      this.setModel({ phone, password, remember });
    });
    effect(() => {
      this.visible();
      if (this.visibleFirstRun) { this.visibleFirstRun = false; return; }
      this.formModel.markAllAsTouched();
    });
  }

  ngOnInit() {}

  private setModel({ phone, password, remember }) {
    this.formModel = this.fb.group({
      phone: [phone, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: [password, [Validators.required, Validators.minLength(6)]],
      remember: [remember]
    });
  }

  onSubmit() {
    const model = this.formModel;
    if (model.valid) {
      this.onLogin.emit(model.value);
    }
  }
}
