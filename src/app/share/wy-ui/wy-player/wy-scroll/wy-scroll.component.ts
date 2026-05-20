import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  effect,
  input,
  output
} from '@angular/core';
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ScrollBar from '@better-scroll/scroll-bar';
import { timer } from 'rxjs';
BScroll.use(ScrollBar);
BScroll.use(MouseWheel);
@Component({
  selector: 'app-wy-scroll',
  standalone: true,
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .wy-scroll {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit {
  data = input<any[]>();

  private bs: BScroll;

  onScrollEnd = output<number>();

  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  constructor(readonly el: ElementRef) {
    effect(() => {
      this.data();
      this.refreshScroll();
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: { interactive: true },
      mouseWheel: {}
    });
    this.bs.on('scrollEnd', ({ y }) => this.onScrollEnd.emit(y));
  }

  private refresh() {
    this.bs.refresh();
  }

  refreshScroll() {
    timer(50).subscribe(() => {
      this.refresh();
    });
  }

  scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }

  scrollTo(...args) {
    this.bs.scrollTo.apply(this.bs, args);
  }
}
