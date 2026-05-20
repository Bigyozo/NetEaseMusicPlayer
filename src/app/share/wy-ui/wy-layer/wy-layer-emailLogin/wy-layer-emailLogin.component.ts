import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { EmailLoginParams, PhoneLoginParams } from 'src/app/services/data.types/member.type';
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
  selector: 'app-wy-layer-emailLogin',
  templateUrl: './wy-layer-emailLogin.component.html',
  styleUrls: ['./wy-layer-emailLogin.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerEmailLoginComponent{
  lanRes: LanguageRes = LANGUAGE_JP;
  wyRememberLogin = input.required<EmailLoginParams>();
  onChangeModalType = output<string | void>();
  visible = input(false);
  onLogin = output<PhoneLoginParams>();
  formModel: FormGroup;
  private visibleFirstRun = true;
  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
    this.formModel = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
      this.cdr.markForCheck();
    });
    effect(() => {
      const params = this.wyRememberLogin();
      let email = '';
      let password = '';
      let remember = false;
      if (params) {
        const value = codeJson(params, 'decode');
        email = value.email;
        password = value.password;
        remember = value.remember;
      }
      this.setModel({ email, password, remember });
    });
    effect(() => {
      this.visible();
      if (this.visibleFirstRun) { this.visibleFirstRun = false; return; }
      this.formModel.markAllAsTouched();
    });
  }


  private setModel({ email, password, remember }) {
    this.formModel = this.fb.group({
      email: [email, [Validators.required, Validators.email]],
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
