import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { LANGUAGE_CH } from '../language/ch';
import { LANGUAGE_EN } from '../language/en';
import { Language } from './data.types/common.types';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor() {}

  private languageSubject = new BehaviorSubject<Language>({
    code: 'ch',
    res: LANGUAGE_CH
  });

  public language$: Observable<Language> = this.languageSubject.asObservable();

  public changeLanguage(code) {
    if (code == 'ch') {
      this.languageSubject.next({
        code: 'ch',
        res: LANGUAGE_CH
      });
    } else if (code == 'en') {
      this.languageSubject.next({
        code: 'en',
        res: LANGUAGE_EN
      });
    }
  }
}
