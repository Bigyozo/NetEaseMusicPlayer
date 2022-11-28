import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SearchResult } from '../../../../services/data.types/common.types';

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit {
  searchResult: SearchResult;
  constructor(private router: Router) {}

  ngOnInit() {}

  toInfo(path: [string, number]) {
    if (path[1]) {
      this.router.navigate(path);
    }
  }
}
