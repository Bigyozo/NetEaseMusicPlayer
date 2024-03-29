import { NgModule } from '@angular/core';

import { ShareModule } from '../../share/share.module';
import { SheetInfoRoutingModule } from './sheet-info-routing.module';
import { SheetInfoComponent } from './sheet-info.component';

@NgModule({
  declarations: [SheetInfoComponent],
  imports: [ShareModule, SheetInfoRoutingModule]
})
export class SheetInfoModule {}
