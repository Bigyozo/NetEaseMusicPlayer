import { User } from 'src/app/services/data.types/member.type';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MemberService } from '../../../../services/member.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  @Output() openModal = new EventEmitter<void>();

  constructor(private memberService: MemberService) {}

  ngOnInit() {}

  onSignin() {
    this.memberService.signin().subscribe(
      (res) => {},
      (error) => {
        console.log(error);
      }
    );
  }
}
