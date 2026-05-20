import { NzMessageService } from 'ng-zorro-antd/message';
import { timer } from 'rxjs';
import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { User } from 'src/app/services/data.types/member.type';
import { LanguageService } from 'src/app/services/language.service';

import { Component, OnInit, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ImgDefaultDirective } from '../../../../share/directives/img-default.directive';

import { MemberService } from '../../../../services/member.service';

@Component({
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzTooltipModule, ImgDefaultDirective],
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  tipTitle = '';
  lanRes: LanguageRes = LANGUAGE_JP;
  showTip = false;
  user = input.required<User>();
  openModal = output<void>();

  constructor(
    private memberService: MemberService,
    private messageService: NzMessageService,
    private languageService: LanguageService
  ) {
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
    });
  }

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
