import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageService } from 'src/app/services/language.service';

import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { LanguageRes, SearchResult } from '../../../../services/data.types/common.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wy-search-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySearchPanelComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  searchResult: SearchResult;
  constructor(private router: Router, private languageService: LanguageService) {
    effect(() => {
      this.lanRes = this.languageService.language().res;
    });
  }

  ngOnInit() { }

  toInfo(path: [string, number]) {
    if (path[1]) {
      this.router.navigate(path);
    }
  }
}
