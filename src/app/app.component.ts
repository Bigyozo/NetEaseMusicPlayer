import { Component } from '@angular/core';

import { SearchResult } from './services/data.types/common.types';
import { SearchService } from './services/search.service';

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

  constructor(private searchService: SearchService) {}

  onSearch(keywords: string) {
    if (keywords) {
      this.searchService.search(keywords).subscribe((res) => {
        this.searchResult = res;
      });
    } else {
      this.searchResult = {};
    }
  }
}
