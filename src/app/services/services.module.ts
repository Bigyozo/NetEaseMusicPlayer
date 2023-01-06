import { isPlatformBrowser } from '@angular/common';
import { InjectionToken, NgModule, PLATFORM_ID } from '@angular/core';

import { httpInterceptorProvides } from './http-interceptors';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WindowToken');

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {
      provide: API_CONFIG,
      useValue: 'http://192.168.40.218:3000/'
    },
    {
      provide: WINDOW,
      useFactory(platformId: Object): Window | Object {
        return isPlatformBrowser(platformId) ? window : {};
      },
      deps: [PLATFORM_ID]
    },
    httpInterceptorProvides
  ]
})
export class ServicesModule {}
