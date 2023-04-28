import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { PhoneLoginParams } from 'src/app/services/data.types/member.type';
import { LanguageService } from 'src/app/services/language.service';
import { codeJson } from 'src/app/utils/base64';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit,
    Output, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-layer-phoneLogin',
  templateUrl: './wy-layer-phoneLogin.component.html',
  styleUrls: ['./wy-layer-phoneLogin.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerPhoneLoginComponent implements OnInit, OnChanges {
  lanRes: LanguageRes = LANGUAGE_CH;
  @Input() wyRememberLogin: PhoneLoginParams;
  @Output() onChangeModalType = new EventEmitter<string | void>();
  @Output() onLogin = new EventEmitter<PhoneLoginParams>();
  @Input() visible = false;
  formModel: FormGroup;
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
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const userLoginParams = changes.wyRememberLogin;
    const visible = changes.visible;
    if (userLoginParams) {
      let phone = '';
      let password = '';
      let remember = false;
      if (userLoginParams.currentValue) {
        const value = codeJson(userLoginParams.currentValue, 'decode');
        phone = value.phone;
        password = value.password;
        remember = value.remember;
      }
      this.setModel({ phone, password, remember });
      if (visible && !visible.firstChange) {
        this.formModel.markAllAsTouched();
      }
    }
  }

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
