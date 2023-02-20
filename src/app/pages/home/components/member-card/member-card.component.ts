import { NzMessageService } from 'ng-zorro-antd';
import { timer } from 'rxjs';
import { User } from 'src/app/services/data.types/member.type';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MemberService } from '../../../../services/member.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  tipTitle = '';
  showTip = false;
  @Input() user: User;
  @Output() openModal = new EventEmitter<void>();

  constructor(private memberService: MemberService, private messageService: NzMessageService) {}

  ngOnInit() {}

  onSignin() {
    this.memberService.signin().subscribe(
      (res) => {
        this.alertMessage('success', '签到成功');
        this.tipTitle = '积分+' + res.point;
        this.showTip = true;
        timer(1500).subscribe(() => (this.showTip = false));
      },
      (error) => {
        this.alertMessage('error', error.message || '签到失败');
      }
    );
  }

  private alertMessage(type: string, msg: string) {
    this.messageService.create(type, msg);
  }
}
