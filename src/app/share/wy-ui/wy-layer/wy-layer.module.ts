import {
    NzAlertModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzIconModule, NzInputModule,
    NzListModule, NzSpinModule
} from 'ng-zorro-antd';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { WyLayerEmailLoginComponent } from './wy-layer-emailLogin/wy-layer-emailLogin.component';
import { WyLayerLikeComponent } from './wy-layer-like/wy-layer-like.component';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerPhoneLoginComponent } from './wy-layer-phoneLogin/wy-layer-phoneLogin.component';
import { WyLayerShareComponent } from './wy-layer-share/wy-layer-share.component';
import { WyLayerRegisterComponent } from './wy-layer-register/wy-layer-register.component';
import { WyCheckCodeComponent } from './wy-check-code/wy-check-code.component';
import { WyCodeComponent } from './wy-check-code/wy-code/wy-code.component';

@NgModule({
  declarations: [
    WyLayerModalComponent,
    WyLayerDefaultComponent,
    WyLayerPhoneLoginComponent,
    WyLayerEmailLoginComponent,
    WyLayerLikeComponent,
    WyLayerShareComponent,
    WyLayerRegisterComponent,
    WyCheckCodeComponent,
    WyCodeComponent
  ],
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
  exports: [
    WyLayerModalComponent,
    WyLayerDefaultComponent,
    WyLayerPhoneLoginComponent,
    WyLayerEmailLoginComponent,
    WyLayerLikeComponent,
    WyLayerShareComponent,
    WyLayerRegisterComponent,
    WyCheckCodeComponent
  ]
})
export class WyLayerModule {}
