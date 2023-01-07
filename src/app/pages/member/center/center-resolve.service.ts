import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { RecordVal, User, UserSheet } from 'src/app/services/data.types/member.type';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { MemberService } from '../../../services/member.service';

type CenterDataType = [User, RecordVal[], UserSheet];

@Injectable({ providedIn: 'root' })
export class CenterResolverService implements Resolve<CenterDataType> {
  constructor(private memberService: MemberService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CenterDataType> {
    const uid = route.paramMap.get('id');
    if (uid) {
      return forkJoin([
        this.memberService.getUserDetail(uid),
        this.memberService.getUserRecord(uid),
        this.memberService.getUserSheets(uid)
      ]).pipe(first());
    } else {
      this.router.navigate(['/home']);
    }
  }
}
