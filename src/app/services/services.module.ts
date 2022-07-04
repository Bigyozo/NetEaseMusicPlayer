import { InjectionToken, NgModule } from '@angular/core';

export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {
      provide: API_CONFIG,
      useValue: 'http://192.168.0.56:3000/'
    }
  ]
})
export class ServicesModule {}
