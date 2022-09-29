import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SheetListComponent } from './sheet-list.component';

const routes: Routes = [
  {
    path: 'sheet',
    component: SheetListComponent,
    data: { title: 'Song Sheet List' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetListRoutingModule {}
