import { Injectable, signal } from '@angular/core';

import { LANGUAGE_JP } from '../language/jp';
import { LANGUAGE_EN } from '../language/en';
import { Language } from './data.types/common.types';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly language = signal<Language>({ code: 'jp', res: LANGUAGE_JP });

  changeLanguage(code: string) {
    if (code === 'jp') {
      this.language.set({ code: 'jp', res: LANGUAGE_JP });
    } else if (code === 'en') {
      this.language.set({ code: 'en', res: LANGUAGE_EN });
    }
  }
}
