import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ShareModule } from 'src/app/share/share.module';
import { HomeComponent } from './home.component';
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';

@NgModule({
  declarations: [HomeComponent, WyCarouselComponent],
  imports: [CommonModule, HomeRoutingModule, ShareModule]
})
export class HomeModule {}
