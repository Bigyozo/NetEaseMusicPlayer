import { map } from 'rxjs/internal/operators';
import { RecordVal, User, UserSheet } from 'src/app/services/data.types/member.type';
import { SheetService } from 'src/app/services/sheet.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less']
})
export class CenterComponent implements OnInit {
  user: User;
  records: RecordVal[];
  userSheet: UserSheet;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private batchActionsService: BatchActionsService
  ) {
    this.route.data.pipe(map((res) => res.user)).subscribe(([user, userRecord, userSheet]) => {
      this.user = user;
      this.records = userRecord;
      this.userSheet = userSheet;
    });
  }

  ngOnInit() {}

  onPlaySheet(id: number) {
    this.sheetService.playsheet(id).subscribe((list) => {
      this.batchActionsService.selectPlayList({ list, index: 0 });
    });
  }
}
