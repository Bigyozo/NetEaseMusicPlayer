import { Inject, Injectable } from '@angular/core';

import { AnyJson } from './data.types/common.types';
import { WINDOW } from './services.module';

@Injectable({
  providedIn: 'root'
})
export class StorgeService {
  constructor(@Inject(WINDOW) private win: Window) {}

  getStorge(key: string, type = 'local'): string {
    return this.win[type + 'Storge'].getItem(key);
  }

  setStorge(params: AnyJson | AnyJson[], type = 'local') {
    const kv = Array.isArray(params) ? params : [params];
    for (const { key, value } of kv) {
      this.win[type + 'Storge'].setItem(key, value.toString());
    }
  }

  removeStorge(params: string | string[], type = 'local') {
    const kv = Array.isArray(params) ? params : [params];
    for (const key of kv) {
      this.win[type + 'Storge'].removeItem(key);
    }
  }
}
