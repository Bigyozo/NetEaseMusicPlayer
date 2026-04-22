import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SongSheet } from 'src/app/services/data.types/common.types';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { SheetService } from '../../services/sheet.service';

@Injectable()
export class SheetInfoResolverService implements Resolve<SongSheet> {
  constructor(private sheetService: SheetService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SongSheet> {
    return this.sheetService.getSongSheetDetail(Number(route.paramMap.get('id'))).pipe(
      catchError(() => {
        this.router.navigate(['/home']);
        return EMPTY;
      })
    );
  }
}
