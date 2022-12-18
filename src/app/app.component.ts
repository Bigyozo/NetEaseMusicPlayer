import { ModalTypes } from 'src/app/store/reducers/member.reducer';

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { SearchResult } from './services/data.types/common.types';
import { SearchService } from './services/search.service';
import { SetModalType } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { AppStoreModule } from './store/index';
import { isEmptyObject } from './utils/tools';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'MusicPlayer by Bigyozo';
  menu = [
    {
      label: '发现',
      path: '/home'
    },
    {
      label: '歌单',
      path: '/sheet'
    }
  ];

  searchResult: SearchResult;

  constructor(
    private searchService: SearchService,
    private store$: Store<AppStoreModule>,
    private batchActionsService: BatchActionsService
  ) {}

  onSearch(keywords: string) {
    if (keywords) {
      this.searchService.search(keywords).subscribe((res) => {
        this.searchResult = this.highlightKeyWord(keywords, res);
      });
    } else {
      this.searchResult = {};
    }
  }

  private highlightKeyWord(keywords: string, result: SearchResult): SearchResult {
    if (!isEmptyObject(result)) {
      const reg = new RegExp(keywords, 'ig');
      ['artists', 'playlists', 'songs'].forEach((type) => {
        if (result[type]) {
          result[type].forEach((element) => {
            element.name = element.name.replace(reg, '<span class="highlight">$&</span>');
          });
        }
      });
    }
    return result;
  }

  onChangeModalType(type = ModalTypes.Default) {
    this.store$.dispatch(SetModalType({ modalType: type }));
  }

  openModal(type: ModalTypes) {
    this.batchActionsService.controlModal(true, type);
  }
}
