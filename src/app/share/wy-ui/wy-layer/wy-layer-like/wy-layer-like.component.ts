import { timer } from 'rxjs';
import { SongSheet } from 'src/app/services/data.types/common.types';
import { LikeSongParams } from 'src/app/services/member.service';
import { AppStoreModule } from 'src/app/store';
import { MemberState } from 'src/app/store/reducers/member.reducer';
import { getLikeId } from 'src/app/store/selectors/member.selectors';

import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output,
    SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createFeatureSelector, select, Store } from '@ngrx/store';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {
  @Input()
  mySheets: SongSheet[];
  @Input()
  likeId: string;
  @Input()
  visible: boolean;
  @Output()
  onLikeSong = new EventEmitter<LikeSongParams>();
  @Output()
  onCreateSheet = new EventEmitter<string>();

  formModel: FormGroup;

  creating = false;
  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      sheetName: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible) {
      if (!this.visible) {
        timer(500).subscribe(() => {
          this.formModel.get('sheetName').reset();
          this.creating = false;
        });
      }
    }
  }

  ngOnInit() {}

  onLike(pid: string) {
    this.onLikeSong.emit({ pid, tracks: this.likeId });
  }

  onSubmit() {
    this.onCreateSheet.emit(this.formModel.get('sheetName').value);
  }
}
