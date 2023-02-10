import { EmailLoginParams, PhoneLoginParams } from 'src/app/services/data.types/member.type';
import { codeJson } from 'src/app/utils/base64';

import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output,
    SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-layer-emailLogin',
  templateUrl: './wy-layer-emailLogin.component.html',
  styleUrls: ['./wy-layer-emailLogin.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerEmailLoginComponent implements OnInit, OnChanges {
  @Input() wyRememberLogin: EmailLoginParams;
  @Output() onChangeModalType = new EventEmitter<string | void>();
  @Input() visible: boolean = false;
  @Output() onLogin = new EventEmitter<PhoneLoginParams>();
  formModel: FormGroup;
  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const userLoginParams = changes['wyRememberLogin'];
    const visible = changes['visible'];
    if (userLoginParams) {
      let email = '';
      let password = '';
      let remember = false;
      if (userLoginParams.currentValue) {
        const value = codeJson(userLoginParams.currentValue, 'decode');
        email = value.email;
        password = value.password;
        remember = value.remember;
      }
      this.setModel({ email, password, remember });
    }
    if (visible && !visible.firstChange) {
      this.formModel.markAllAsTouched();
    }
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
