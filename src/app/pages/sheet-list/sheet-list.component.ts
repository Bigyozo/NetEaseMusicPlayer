import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageService } from 'src/app/services/language.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LanguageRes, SheetList } from '../../services/data.types/common.types';
import { SheetParams, SheetService } from '../../services/sheet.service';
import { BatchActionsService } from '../../store/batch-actions.service';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_CH;
  listParams: SheetParams = {
    cat: '全部',
    order: 'hot',
    offset: 1,
    limit: 15
  };
  sheets: SheetList;
  orderValue = 'hot';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetService: SheetService,
    private batchActionsService: BatchActionsService,
    private languageService: LanguageService
  ) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
    });
  }

  private getList() {
    this.sheetService.getSheets(this.listParams).subscribe((res) => (this.sheets = res));
  }

  onPlaySheet(id: number) {
    this.sheetService.playsheet(id).subscribe((list) => {
      this.batchActionsService.selectPlayList({ list, index: 0 });
    });
  }

  ngOnInit() {}

  onOrderChange(order: 'hot' | 'highquality') {
    this.listParams.order = order;
    this.listParams.offset = 1;
    this.getList();
  }

  onPageChange(page: number) {
    this.listParams.offset = page;
    this.getList();
  }

  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }
}
