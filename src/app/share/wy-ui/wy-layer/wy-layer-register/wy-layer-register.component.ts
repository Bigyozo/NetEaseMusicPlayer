import { NzMessageService } from 'ng-zorro-antd/message';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { ModalTypes } from 'src/app/store/member-store.service';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect, input, output
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { WyCheckCodeComponent } from '../wy-check-code/wy-check-code.component';

import { MemberService } from '../../../../services/member.service';

enum Exist {
  Exists = 1,
  NotExists = -1
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, WyCheckCodeComponent],
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  visible = input(false);
  onChangeModalType = output<string>();
  showCode = false;
  formModel: FormGroup;
  timing: number;
  codePass = false;
  onRegister = output<string>();
  private visibleFirstRun = true;
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
    effect(() => {
      const v = this.visible();
      if (this.visibleFirstRun) { this.visibleFirstRun = false; return; }
      if (!v) {
        this.showCode = false;
        this.formModel.reset();
        this.cdr.markForCheck();
      }
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.formModel.valid) {
      this.sendCode();
    }
  }

  sendCode() {
    this.memberService.sendCode(this.formModel.get('phone').value).subscribe({
      next: () => {
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
      error: (err) => {
        this.messageService.error(err.message);
      }
    });
  }

  changeType(type = ModalTypes.Default) {
    this.showCode = false;
    this.formModel.reset();
    this.onChangeModalType.emit(type);
  }

  onCheckCode(code: string) {
    this.memberService.checkCode(this.formModel.get('phone').value, Number(code)).subscribe({
      next: () => {
        this.codePass = true;
      },
      error: () => {
        this.codePass = false;
      },
      complete: () => {
        this.cdr.markForCheck();
      }
    });
  }

  onCheckExist() {
    const phone = this.formModel.get('phone').value;
    this.memberService.checkExist(Number(phone)).subscribe((res) => {
      if (res === Exist.Exists) {
        this.messageService.error(this.lanRes.C00083);
        this.changeType(ModalTypes.LoginByPhone);
      } else {
        this.onRegister.emit(phone);
      }
    });
  }
}
