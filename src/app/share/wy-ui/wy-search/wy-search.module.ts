import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import { WySearchComponent } from './wy-search.component';

@NgModule({
  declarations: [WySearchComponent, WySearchPanelComponent],
  imports: [CommonModule, NzIconModule, NzInputModule, OverlayModule],
  exports: [WySearchComponent]
})
export class WySearchModule {}
