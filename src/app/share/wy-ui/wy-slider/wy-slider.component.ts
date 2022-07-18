import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pluck,
  tap
} from 'rxjs/internal/operators';
import { inArray } from 'src/app/utils/array';
import {
  getPercent,
  limitNumberRange,
  valuesEqual
} from 'src/app/utils/number';
import { getElementOffset, sliderEvent } from './wy-slider-helper';
import { SliderEventObserverConfig, SliderValue } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WySliderComponent),
      multi: true
    }
  ]
})
export class WySliderComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  //滑块是否垂直
  @Input() wyVertical = false;
  //滑块起点
  @Input() wyMin = 0;
  //滑块终点
  @Input() wyMax = 100;
  //缓冲条
  @Input() bufferOffset: SliderValue = 0;
  private slideDom: HTMLDivElement;

  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;
  //滑块是否在移动
  private isDragging = false;
  //父组件计算的滑块位置
  value: SliderValue = null;
  //传给子组件的滑块位置
  offset: SliderValue = null;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private cdr: ChangeDetectorRef
  ) {}

  //订阅事件流
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  //订阅事件对象，用于解绑
  private dragStart_: Subscription | null;
  private dragMove_: Subscription | null;
  private dragEnd_: Subscription | null;

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
    //手机端PC端事件合并
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

  // 订阅事件
  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  //解绑事件
  private unSubscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    if (inArray(events, 'move') && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if (inArray(events, 'end') && this.dragEnd_) {
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }

  private onDragStart(value: number) {
    this.toggleDragMoving(true);
    this.setValue(value);
  }

  private onDragMove(value: number) {
    if (this.isDragging) {
      this.setValue(value);
      //手动变更检测
      this.cdr.markForCheck();
    }
  }

  private onDragEnd() {
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private toggleDragMoving(movable: boolean) {
    this.isDragging = movable;
    if (movable) {
      this.subscribeDrag(['move', 'end']);
    } else {
      this.unSubscribeDrag(['move', 'end']);
    }
  }

  private setValue(value: SliderValue, needCheck = false) {
    if (needCheck) {
      if (this.isDragging) return;
      this.value = this.formatValue(value);
      this.updateTrackAndHandles();
    }
    if (!valuesEqual(this.value, value)) {
      this.value = value;
      this.updateTrackAndHandles();
      this.onValueChange(this.value);
    }
  }

  private formatValue(value: SliderValue): SliderValue {
    let res = value;
    if (this.assertValueValid(value)) {
      res = this.wyMin;
    } else {
      res = limitNumberRange(value, this.wyMin, this.wyMax);
    }
    return res;
  }

  private assertValueValid(value: SliderValue): boolean {
    return isNaN(typeof value != 'number' ? parseFloat(value) : value);
  }

  private updateTrackAndHandles() {
    this.offset = this.getValueToOffset(this.value);
    this.cdr.markForCheck();
  }

  private getValueToOffset(value: SliderValue): SliderValue {
    return getPercent(value, this.wyMin, this.wyMax);
  }

  ngOnDestroy(): void {
    this.unSubscribeDrag();
  }

  private onValueChange(value: SliderValue): void {}

  private onTouched(): void {}

  writeValue(val: SliderValue): void {
    this.setValue(val, true);
  }

  registerOnChange(fn: (value: SliderValue) => void): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
