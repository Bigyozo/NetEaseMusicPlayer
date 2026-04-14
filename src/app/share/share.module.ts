import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { WyUiModule } from './wy-ui/wy-ui.module';

const NZ_MODULES = [
  NzAvatarModule,
  NzButtonModule,
  NzCarouselModule,
  NzCheckboxModule,
  NzDividerModule,
  NzFloatButtonModule,
  NzFormModule,
  NzIconModule,
  NzInputModule,
  NzLayoutModule,
  NzListModule,
  NzMenuModule,
  NzModalModule,
  NzPaginationModule,
  NzProgressModule,
  NzRadioModule,
  NzSpinModule,
  NzTableModule,
  NzTagModule,
  NzTooltipModule
];

@NgModule({
  imports: [CommonModule, ...NZ_MODULES, FormsModule, WyUiModule],
  exports: [CommonModule, ...NZ_MODULES, FormsModule, WyUiModule]
})
export class ShareModule {}
