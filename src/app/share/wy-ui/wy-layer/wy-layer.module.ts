import { NzButtonModule } from 'ng-zorro-antd';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';

@NgModule({
  declarations: [WyLayerModalComponent, WyLayerDefaultComponent],
  imports: [CommonModule, NzButtonModule, DragDropModule],
  exports: [WyLayerModalComponent, WyLayerDefaultComponent]
})
export class WyLayerModule {}
