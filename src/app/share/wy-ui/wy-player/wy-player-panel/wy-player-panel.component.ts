import { timer } from 'rxjs';
import { Song } from 'src/app/services/data.types/common.types';
import { SongService } from 'src/app/services/song.service';
import { findIndex } from 'src/app/utils/array';

import {
    Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges,
    ViewChildren
} from '@angular/core';

import { Lyric } from '../../../../services/data.types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { BaseLyricLine, WyLyric } from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  @Input() playing: boolean;
  @Input() songList: Song[];
  @Input() currentSong: Song;
  currentIndex: number;
  @Input() show: boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  @Output() onDeleteSong = new EventEmitter<Song>();
  @Output() onClearSong = new EventEmitter<void>();

  scrollY = 0;
  currentLyric: BaseLyricLine[];
  @ViewChildren(WyScrollComponent)
  private wyScroll: QueryList<WyScrollComponent>;
  private lyric: WyLyric;
  currentLineNum: number = 0;
  lyricRefs: NodeList;

  constructor(private songService: SongService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playing']) {
      if (!changes['playing'].firstChange) {
        this.lyric && this.lyric.togglePlay(this.playing);
      }
    }

    if (changes['songList']) {
      this.updateCurrentIndex();
    }

    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findIndex(this.songList, this.currentSong);
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      } else {
        this.resetLyric();
      }
    }

    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();
        timer(80).subscribe(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }
        });
      }
    }
  }

  private updateCurrentIndex() {
    this.currentIndex = findIndex(this.songList, this.currentSong);
  }

  private updateLyric() {
    this.resetLyric();
    this.songService.getLyric(this.currentSong.id).subscribe((res) => {
      this.lyric = new WyLyric(res);
      this.currentLyric = this.lyric.lines;
      const startLine = res.tlyric ? 1 : 2;
      this.handleLyric(startLine);
      this.wyScroll.last.scrollTo(0, 0);

      if (this.playing) {
        this.lyric.play();
      }
    });
  }

  private resetLyric() {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
      this.currentLyric = [];
      this.currentLineNum = 0;
      this.lyricRefs = null;
    }
  }

  seekLyric(time: number) {
    if (this.lyric) {
      this.lyric.seek(time);
    }
  }

  private handleLyric(startLine: number = 2) {
    this.lyric.handler.subscribe(({ lineNum }) => {
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
      }
      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        if (lineNum > startLine) {
          const targetLine = this.lyricRefs[lineNum - startLine];
          if (targetLine) {
            this.wyScroll.last.scrollToElement(targetLine, 300, false, false);
          }
        } else {
          this.wyScroll.last.scrollTo(0, 0);
        }
      }
    });
  }

  private scrollToCurrent(speed = 300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      if (
        offsetTop - Math.abs(this.scrollY) > currentLi.offsetHeight * 5 ||
        offsetTop < Math.abs(this.scrollY)
      ) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }
}
