import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pluck,
  tap
} from 'rxjs/internal/operators';
import { inArray } from 'src/app/utils/array';
import { limitNumberRange } from 'src/app/utils/number';
import { getElementOffset, sliderEvent } from './wy-slider-helper';
import { SliderEventObserverConfig } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderComponent implements OnInit {
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;

  private slideDom: HTMLDivElement;

  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  ngOnInit() {
    this.slideDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  private createDraggingObservables() {
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };
    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };

    [mouse, touch].forEach((source) => {
      const { start, move, end, filter: filerFunc, pluckKey } = source;
      source.startPlucked$ = fromEvent(this.slideDom, start).pipe(
        filter(filerFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        map((position: number) => this.findClosestValue(position))
      );

      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filerFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position))
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }
  private findClosestValue(position: number): number {
    //获取滑块总长
    const sliderLength = this.getSliderLength();
    //滑块（左上）端点位置
    const sliderStart = this.getSliderStartPosition();
    const ratio = limitNumberRange(
      (position - sliderStart) / sliderLength,
      0,
      1
    );
    const realRatio = this.wyVertical ? 1 - ratio : ratio;
    return realRatio * (this.wyMax - this.wyMin) + this.wyMin;
  }
  private getSliderStartPosition() {
    const offset = getElementOffset(this.slideDom);
    return this.wyVertical ? offset.top : offset.left;
  }
  private getSliderLength() {
    return this.wyVertical
      ? this.slideDom.clientHeight
      : this.slideDom.clientWidth;
  }

  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$) {
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private onDragStart(value: number) {
    console.log('value;' + value);
  }
  private onDragMove(value: number) {}
  private onDragEnd() {}
}
