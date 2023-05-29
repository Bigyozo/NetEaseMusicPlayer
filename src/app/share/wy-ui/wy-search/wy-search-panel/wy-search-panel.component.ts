import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageService } from 'src/app/services/language.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageRes, SearchResult } from '../../../../services/data.types/common.types';

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_CH;
  searchResult: SearchResult;
  constructor(private router: Router, private languageService: LanguageService) {
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
    });
  }

  ngOnInit() {}

  toInfo(path: [string, number]) {
    if (path[1]) {
      this.router.navigate(path);
    }
  }
}
