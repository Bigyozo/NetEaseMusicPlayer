import { DOCUMENT, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  input,
  output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pluck,
  tap
} from 'rxjs/operators';
import { inArray } from 'src/app/utils/array';
import {
  getPercent,
  limitNumberRange,
  valuesEqual
} from 'src/app/utils/number';
import { getElementOffset, sliderEvent } from './wy-slider-helper';
import { SliderEventObserverConfig, SliderValue } from './wy-slider-types';
import { WySliderTrackComponent } from './wy-slider-track.component';
import { WySliderHandleComponent } from './wy-slider-handle.component';

@Component({
  selector: 'app-wy-slider',
  standalone: true,
  imports: [CommonModule, WySliderTrackComponent, WySliderHandleComponent],
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
  implements OnInit, OnDestroy, ControlValueAccessor {
  private doc = inject(DOCUMENT);
  // スライダーが垂直か
  wyVertical = input(false);
  // スライダーの最小値
  wyMin = input(0);
  // スライダーの最大値
  wyMax = input(100);
  // バッファバー
  bufferOffset = input<SliderValue>(0);
  private slideDom: HTMLDivElement;

  wyOnAfterChange = output<SliderValue>();

  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;
  // スライダーがドラッグ中か
  private isDragging = false;
  // 親コンポーネントが計算したスライダー位置
  value: SliderValue = null;
  // 子コンポーネントに渡すスライダー位置
  offset: SliderValue = null;

  constructor(private cdr: ChangeDetectorRef) {}

  // イベントストリームをサブスクライブ
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  // サブスクリプションオブジェクト（解除用）
  private dragStart_: Subscription | null;
  private dragMove_: Subscription | null;
  private dragEnd_: Subscription | null;

  ngOnInit() {
    this.slideDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  private createDraggingObservables() {
    const orientField = this.wyVertical() ? 'pageY' : 'pageX';
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
    // モバイル・PC のイベントをマージ
    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

  private findClosestValue(position: number): number {
    // スライダーの全長を取得
    const sliderLength = this.getSliderLength();
    // スライダーの（左上）端点の位置
    const sliderStart = this.getSliderStartPosition();
    const ratio = limitNumberRange(
      (position - sliderStart) / sliderLength,
      0,
      1
    );
    const realRatio = this.wyVertical() ? 1 - ratio : ratio;
    return realRatio * (this.wyMax() - this.wyMin()) + this.wyMin();
  }
  private getSliderStartPosition() {
    const offset = getElementOffset(this.slideDom);
    return this.wyVertical() ? offset.top : offset.left;
  }
  private getSliderLength() {
    return this.wyVertical()
      ? this.slideDom.clientHeight
      : this.slideDom.clientWidth;
  }

  // イベントをサブスクライブ
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

  // イベントの購読解除
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
      // 変更検出を手動で実行
      this.cdr.markForCheck();
    }
  }

  private onDragEnd() {
    this.wyOnAfterChange.emit(this.value);
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
      if (this.isDragging) { return; }
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
      res = this.wyMin();
    } else {
      res = limitNumberRange(value, this.wyMin(), this.wyMax());
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
    return getPercent(value, this.wyMin(), this.wyMax());
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
