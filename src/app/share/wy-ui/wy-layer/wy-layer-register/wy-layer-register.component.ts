import { NzMessageService } from 'ng-zorro-antd';
import { interval } from 'rxjs';
import { take } from 'rxjs/internal/operators';

import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output,
    SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MemberService } from '../../../../services/member.service';

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Output() onChangeModalType = new EventEmitter<string | void>();
  showCode: boolean = false;
  formModel: FormGroup;
  timing: number;
  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private messageService: NzMessageService
  ) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const visible = changes['visible'];
    if (visible && !visible.firstChange) {
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
        interval(1000)
          .pipe(take(60))
          .subscribe(() => {
            this.timing--;
          });
      },
      (error) => {
        this.messageService.error(error.message);
      }
    );
  }

  changeType() {
    this.showCode = false;
    this.formModel.reset();
    this.onChangeModalType.emit('default');
  }
}
