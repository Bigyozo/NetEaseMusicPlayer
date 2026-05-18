import { Observable } from 'rxjs';
import { SongSheet } from 'src/app/services/data.types/common.types';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { SheetService } from '../../services/sheet.service';

@Injectable()
export class SheetInfoResolverService implements Resolve<SongSheet> {
  constructor(private sheetService: SheetService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SongSheet> {
    return this.sheetService.getSongSheetDetail(Number(route.paramMap.get('id')));
  }
}
