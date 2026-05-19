import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { LANGUAGE_JP } from '../language/jp';
import { LANGUAGE_EN } from '../language/en';
import { Language } from './data.types/common.types';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor() {}

  private languageSubject = new BehaviorSubject<Language>({
    code: 'jp',
    res: LANGUAGE_JP
  });

  public language$: Observable<Language> = this.languageSubject.asObservable();

  public changeLanguage(code) {
    if (code == 'jp') {
      this.languageSubject.next({
        code: 'jp',
        res: LANGUAGE_JP
      });
    } else if (code == 'en') {
      this.languageSubject.next({
        code: 'en',
        res: LANGUAGE_EN
      });
    }
  }
}
