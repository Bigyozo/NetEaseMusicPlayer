import { NgModule } from '@angular/core';

import { HomeModule } from './home/home.module';
import { SheetInfoModule } from './sheet-info/sheet-info.module';
import { SheetListModule } from './sheet-list/sheet-list.module';

@NgModule({
  declarations: [],
  imports: [HomeModule, SheetListModule, SheetInfoModule],
  exports: [HomeModule, SheetListModule, SheetInfoModule]
})
export class PagesModule {}
