import { NgModule } from '@angular/core';

import { ShareModule } from '../../share/share.module';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';
import { SingerRoutingModule } from './singer-routing.module';

@NgModule({
  declarations: [SingerDetailComponent],
  imports: [ShareModule, SingerRoutingModule]
})
export class SingerModule {}
