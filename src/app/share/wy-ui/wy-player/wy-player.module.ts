import { NzToolTipModule } from 'ng-zorro-antd';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClickoutsideDirective } from '../../directives/clickoutside.directive';
import { FormatTimePipe } from '../../pipes/format-time.pipe';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { WyPlayerComponent } from './wy-player.component';
import { WyScrollComponent } from './wy-scroll/wy-scroll.component';

@NgModule({
  declarations: [
    WyPlayerComponent,
    FormatTimePipe,
    WyPlayerPanelComponent,
    WyScrollComponent,
    ClickoutsideDirective
  ],
  imports: [CommonModule, WySliderModule, FormsModule, NzToolTipModule],
  exports: [WyPlayerComponent, FormatTimePipe, ClickoutsideDirective]
})
export class WyPlayerModule {}
