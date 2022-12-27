import {
    NzAlertModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzIconModule, NzInputModule,
    NzListModule, NzSpinModule
} from 'ng-zorro-antd';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';

@NgModule({
  declarations: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    DragDropModule,
    ReactiveFormsModule,
    NzInputModule,
    NzCheckboxModule,
    NzSpinModule,
    NzAlertModule,
    NzListModule,
    NzIconModule,
    NzFormModule,
    FormsModule
  ],
  exports: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent]
})
export class WyLayerModule {}