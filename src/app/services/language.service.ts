import { Injectable } from '@angular/core';

import { LANGUAGE_CH } from '../language/ch';
import { LANGUAGE_EN } from '../language/en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor() {}

  public languageRes = LANGUAGE_CH;

  public changeLanguage(lan) {
    if (lan == 'ch') {
      this.languageRes = LANGUAGE_CH;
    } else if (lan == 'en') {
      this.languageRes = LANGUAGE_EN;
    }
  }
}
