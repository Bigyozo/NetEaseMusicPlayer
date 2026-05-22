import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  input,
  output
} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  standalone: true,
  imports: [NzIconModule],
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCarouselComponent implements OnInit {
  activeIndex = input(0);

  changeSlide = output<'pre' | 'next'>();

  @ViewChild('dot', { static: true }) dotRef: TemplateRef<any>;

  constructor() {}

  ngOnInit() {}

  onChangeSlide(type: 'pre' | 'next') {
    this.changeSlide.emit(type);
  }
}
