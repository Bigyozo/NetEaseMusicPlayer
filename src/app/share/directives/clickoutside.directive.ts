import { DOCUMENT } from '@angular/common';
import {
    Directive, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, Renderer2, SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[appClickoutside]'
})
export class ClickoutsideDirective implements OnChanges {
  private handleClick: () => void;
  @Input() bindFlag = false;
  @Output() onClickOutside = new EventEmitter<void>();
  constructor(
    private el: ElementRef,
    private rd: Renderer2,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bindFlag && !changes.bindFlag.firstChange) {
      if (this.bindFlag) {
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
    }
  }
}
