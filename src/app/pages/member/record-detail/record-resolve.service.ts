import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { RecordVal, User } from 'src/app/services/data.types/member.type';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { MemberService } from '../../../services/member.service';

type RecordDataType = [User, RecordVal[]];

@Injectable({ providedIn: 'root' })
export class RecordResolverService implements Resolve<RecordDataType> {
  constructor(private memberService: MemberService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<RecordDataType> {
    const uid = route.paramMap.get('id');
    if (uid) {
      return forkJoin([
        this.memberService.getUserDetail(uid),
        this.memberService.getUserRecord(uid)
      ]).pipe(first());
    } else {
      this.router.navigate(['/home']);
    }
  }
}
