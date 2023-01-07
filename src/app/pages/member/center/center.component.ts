import { map } from 'rxjs/internal/operators';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserRecord, UserSheet } from '../../../services/data.types/member.type';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less']
})
export class CenterComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
    this.route.data.pipe(map((res) => res.user)).subscribe(([user, userRecord, userSheet]) => {
      console.log('user', user);
      console.log('userRecord', userRecord);
      console.log('userSheet', userSheet);
    });
  }

  ngOnInit() {}
}
