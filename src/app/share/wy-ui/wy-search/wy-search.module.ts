import { NzIconModule, NzInputModule } from 'ng-zorro-antd';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WySearchComponent } from './wy-search.component';

@NgModule({
  declarations: [WySearchComponent],
  imports: [CommonModule, NzIconModule, NzInputModule],
  exports: [WySearchComponent]
})
export class WySearchModule {}
