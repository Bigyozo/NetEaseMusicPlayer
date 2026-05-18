import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideNzI18n, ja_JP } from 'ng-zorro-antd/i18n';

import { routes } from './app.routes';
import { memberReducer } from './store/reducers/member.reducer';
import { playerReducer } from './store/reducers/player.reducer';
import { commonInterceptor } from './services/http-interceptors/common.interceptor';
import { API_CONFIG } from './services/tokens';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideHttpClient(withInterceptors([commonInterceptor])),
    provideAnimations(),
    provideNzI18n(ja_JP),
    { provide: API_CONFIG, useValue: '/api/' },
    provideStore(
      { player: playerReducer, member: memberReducer },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true
        }
      }
    ),
    provideStoreDevtools({
      maxAge: 20,
      logOnly: environment.production
    })
  ]
};
