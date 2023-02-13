import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { BACKSPACE } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CODELEN = 4;

@Component({
  selector: 'app-wy-code',
  templateUrl: './wy-code.component.html',
  styleUrls: ['./wy-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WyCodeComponent),
      multi: true
    }
  ]
})
export class WyCodeComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  inputArr = [];
  inputEl: HTMLElement[];
  private code: string;
  private destory$ = new Subject();
  result: string[] = [];
  currentFocusIndex = 0;
  @ViewChild('codeWrap', { static: true }) private codeWrap: ElementRef;
  constructor(private cdr: ChangeDetectorRef) {
    this.inputArr = Array(CODELEN).fill('');
  }

  ngOnDestroy(): void {
    this.destory$.next();
  }

  ngAfterViewInit(): void {
    this.inputEl = this.codeWrap.nativeElement.getElementsByClassName('item') as HTMLElement[];
    console.log(this.inputEl);
    this.inputEl[0].focus();
    for (let a = 0; a < this.inputEl.length; a++) {
      const item = this.inputEl[a];
      fromEvent(item, 'keyup')
        .pipe(takeUntil(this.destory$))
        .subscribe((event: KeyboardEvent) => this.listenKeyUp(event));
      fromEvent(item, 'click')
        .pipe(takeUntil(this.destory$))
        .subscribe(() => (this.currentFocusIndex = a));
    }
  }

  private listenKeyUp(event: KeyboardEvent): void {
    const target = <HTMLInputElement>event.target;
    const value = target.value;
    const isBackSpace = event.keyCode === BACKSPACE;
    if (/\D/.test(value)) {
      target.value = '';
      this.result[this.currentFocusIndex] = '';
    } else if (value) {
      this.result[this.currentFocusIndex] = value;
      this.currentFocusIndex = (this.currentFocusIndex + 1) % CODELEN;
      this.inputEl[this.currentFocusIndex].focus();
    } else if (isBackSpace) {
      this.result[this.currentFocusIndex] = '';
      this.currentFocusIndex = Math.max(this.currentFocusIndex - 1, 0);
      this.inputEl[this.currentFocusIndex].focus();
    }
    this.checkResult(this.result);
  }

  private checkResult(result: string[]) {
    const codeStr = result.join('');
    this.setValue(codeStr);
  }

  private setValue(code: string) {
    this.code = code;
    this.onValueChange(code);
    this.cdr.markForCheck();
  }

  private onValueChange(value: string) {}
  private onTouched() {}

  writeValue(value: string): void {
    this.setValue(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnInit() {}
}
