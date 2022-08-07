import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { first } from 'rxjs/internal/operators';
import { Song } from 'src/app/services/data.types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show: boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  scrollY = 0;

  @ViewChildren(WyScrollComponent)
  private wyScroll: QueryList<WyScrollComponent>;
  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSong']) {
      if (this.currentSong) {
        if (this.show) {
          this.scrollToCurrent();
        }
      } else {
      }
    }

    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        setTimeout(() => {
          if (this.currentSong) {
            this.scrollToCurrent();
          }
        }, 80);
      }
    }
  }

  private scrollToCurrent() {
    const songListRefs =
      this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      if (
        offsetTop - Math.abs(this.scrollY) > currentLi.offsetHeight * 5 ||
        offsetTop < Math.abs(this.scrollY)
      ) {
        this.wyScroll.first.scrollToElement(currentLi, 300, false, false);
      }
    }
  }
}
