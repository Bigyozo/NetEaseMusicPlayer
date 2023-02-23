import { InjectionToken, NgModule } from '@angular/core';

import { httpInterceptorProvides } from './http-interceptors';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WindowToken');

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {
      provide: API_CONFIG,
      useValue: '/api/'
    },
    httpInterceptorProvides
  ]
})
export class ServicesModule {}
