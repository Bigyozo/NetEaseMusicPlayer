import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNzI18n, ja_JP } from 'ng-zorro-antd/i18n';

import { routes } from './app.routes';
import { commonInterceptor } from './services/http-interceptors/common.interceptor';
import { API_CONFIG } from './services/tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideHttpClient(withInterceptors([commonInterceptor])),
    provideAnimations(),
    provideNzI18n(ja_JP),
    { provide: API_CONFIG, useValue: '/api/' }
  ]
};
