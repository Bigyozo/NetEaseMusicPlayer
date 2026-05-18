import { NzMessageService } from 'ng-zorro-antd';
import { interval } from 'rxjs';
import { take } from 'rxjs/internal/operators';
import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit,
    Output, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MemberService } from '../../../../services/member.service';

enum Exist {
  '存在' = 1,
  '不存在' = -1
}

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit, OnChanges {
  lanRes: LanguageRes = LANGUAGE_CH;
  @Input() visible = false;
  @Output() onChangeModalType = new EventEmitter<string>();
  showCode = false;
  formModel: FormGroup;
  timing: number;
  codePass = false;
  @Output()
  onRegister = new EventEmitter<string>();
  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService
  ) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const visible = changes.visible;
    if (visible && !visible.firstChange) {
      if (!this.visible) {
        this.showCode = false;
      }
      this.formModel.markAllAsTouched();
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.formModel.valid) {
      this.sendCode();
    }
  }

  sendCode() {
    this.memberService.sendCode(this.formModel.get('phone').value).subscribe(
      () => {
        this.timing = 60;
        if (!this.showCode) {
          this.showCode = true;
        }
        this.cdr.markForCheck();
        interval(1000)
          .pipe(take(60))
          .subscribe(() => {
            this.timing--;
            this.cdr.markForCheck();
          });
      },
      (error) => {
        this.messageService.error(error.message);
      }
    );
  }

  changeType(type = ModalTypes.Default) {
    this.showCode = false;
    this.formModel.reset();
    this.onChangeModalType.emit(type);
  }

  onCheckCode(code: string) {
    this.memberService.checkCode(this.formModel.get('phone').value, Number(code)).subscribe(
      () => {
        this.codePass = true;
      },
      () => {
        this.codePass = false;
      },
      () => {
        this.cdr.markForCheck();
      }
    );
  }

  onCheckExist() {
    const phone = this.formModel.get('phone').value;
    this.memberService.checkExist(Number(phone)).subscribe((res) => {
      if (Exist[res] === '存在') {
        this.messageService.error('账号已存在，可直接登陆');
        this.changeType(ModalTypes.LoginByPhone);
      } else {
        this.onRegister.emit(phone);
      }
    });
  }
}
