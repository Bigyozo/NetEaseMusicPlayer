import { environment } from 'src/environments/environment';

import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { memberReducer } from './reducers/member.reducer';
import { playerReducer } from './reducers/player.reducer';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot(
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
    StoreDevtoolsModule.instrument({
      maxAge: 20,
      logOnly: environment.production
    })
  ]
})
export class AppStoreModule {}
