import { DOCUMENT } from '@angular/common';
import {
    Directive, ElementRef, Renderer2, effect, inject, input, output
} from '@angular/core';

@Directive({
  selector: '[appClickoutside]',
  standalone: true
})
export class ClickoutsideDirective {
  private doc = inject(DOCUMENT);
  private handleClick: () => void;
  bindFlag = input(false);
  onClickOutside = output<void>();
  private bindFlagFirstRun = true;
  constructor(
    private el: ElementRef,
    private rd: Renderer2
  ) {
    effect(() => {
      const flag = this.bindFlag();
      if (this.bindFlagFirstRun) { this.bindFlagFirstRun = false; return; }
      if (flag) {
        this.handleClick = this.rd.listen(this.doc, 'click', (evt) => {
          const target = evt.target;
          const isContain = this.el.nativeElement.contains(target);
          if (!isContain) {
            this.onClickOutside.emit(target);
          }
        });
      } else {
        this.handleClick();
      }
    });
  }
}
