import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { AnyJson } from './data.types/common.types';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private plateformId = inject<object>(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.plateformId);

  getStorage(key: string, type = 'local'): string {
    if (this.isBrowser) {
      return window[type + 'Storage'].getItem(key);
    }
    return '';
  }

  setStorage(params: AnyJson | AnyJson[], type = 'local') {
    if (this.isBrowser) {
      const kv = Array.isArray(params) ? params : [params];
      for (const { key, value } of kv) {
        window[type + 'Storage'].setItem(key, value.toString());
      }
    }
  }

  removeStorge(params: string | string[], type = 'local') {
    if (this.isBrowser) {
      const kv = Array.isArray(params) ? params : [params];
      for (const key of kv) {
        window[type + 'Storage'].removeItem(key);
      }
    }
  }
}
