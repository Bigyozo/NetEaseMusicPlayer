import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SheetList } from '../../services/data.types/common.types';
import { SheetParams, SheetService } from '../../services/sheet.service';
import { BatchActionsService } from '../../store/batch-actions.service';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
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
    private sheetService: SheetService,
    private batchActionsService: BatchActionsService
  ) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
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
}
