import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySliderStyle } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider-handle',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="wy-slider-handle" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderHandleComponent implements OnInit {
  wyVertical = input(false);
  wyOffset = input.required<number>();
  style: WySliderStyle = {};
  constructor() {
    effect(() => {
      this.style[this.wyVertical() ? 'bottom' : 'left'] = this.wyOffset() + '%';
    });
  }

  ngOnInit() {}
}
