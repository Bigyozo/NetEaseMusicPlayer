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
  selector: 'app-wy-slider-track',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    class="wy-slider-track"
    [class.buffer]="wyBuffer()"
    [ngStyle]="style"
  ></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderTrackComponent implements OnInit {
  wyVertical = input(false);
  wyLength = input.required<number>();
  wyBuffer = input(false);
  style: WySliderStyle = {};
  constructor() {
    effect(() => {
      const length = this.wyLength();
      const vertical = this.wyVertical();
      if (vertical) {
        this.style.height = length + '%';
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = length + '%';
        this.style.bottom = null;
        this.style.height = null;
      }
    });
  }

  ngOnInit() {}
}
