import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from '../services/services.module';
import { PagesModule } from '../pages/pages.module';
import { ShareModule } from '../share/share.module';
import ja from '@angular/common/locales/ja';
import { registerLocaleData } from '@angular/common';
import { NZ_I18N, ja_JP } from 'ng-zorro-antd';
import { AppStoreModule } from '../store';

registerLocaleData(ja);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    PagesModule,
    ShareModule,
    AppRoutingModule,
    AppStoreModule
  ],
  exports: [ShareModule, AppRoutingModule],
  providers: [{ provide: NZ_I18N, useValue: ja_JP }]
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule can only be imported by AppModule');
    }
  }
}
