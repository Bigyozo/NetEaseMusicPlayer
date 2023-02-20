import { Inject, Injectable } from '@angular/core';

import { AnyJson } from './data.types/common.types';
import { WINDOW } from './services.module';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(WINDOW) private window: Window) {}

  getStorage(key: string, type = 'local'): string {
    return window[type + 'Storage'].getItem(key);
  }

  setStorage(params: AnyJson | AnyJson[], type = 'local') {
    const kv = Array.isArray(params) ? params : [params];
    for (const { key, value } of kv) {
      window[type + 'Storage'].setItem(key, value.toString());
    }
  }

  removeStorge(params: string | string[], type = 'local') {
    const kv = Array.isArray(params) ? params : [params];
    for (const key of kv) {
      window[type + 'Storage'].removeItem(key);
    }
  }
}
