import { timer } from 'rxjs';
import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageRes, Song } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { SongService } from 'src/app/services/song.service';
import { findIndex } from 'src/app/utils/array';

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';

import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { BaseLyricLine, WyLyric } from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  lanRes: LanguageRes = LANGUAGE_CH;
  @Input() playing: boolean;
  @Input() songList: Song[];
  @Input() currentSong: Song;
  currentIndex: number;
  @Input() show: boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  @Output() onDeleteSong = new EventEmitter<Song>();
  @Output() onClearSong = new EventEmitter<void>();
  @Output() onToInfo = new EventEmitter<[string, number]>();
  @Output() onLikeSong = new EventEmitter<string>();
  @Output() onShareSong = new EventEmitter<Song>();

  scrollY = 0;
  currentLyric: BaseLyricLine[];
  @ViewChildren(WyScrollComponent)
  private wyScroll: QueryList<WyScrollComponent>;
  private lyric: WyLyric;
  currentLineNum = 0;
  private startLine = 2;
  lyricRefs: NodeList;

  constructor(private songService: SongService, private languageService: LanguageService) {
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.playing) {
      if (!changes.playing.firstChange) {
        this.lyric && this.lyric.togglePlay(this.playing);
      }
    }

    if (changes.songList) {
      if (this.currentSong) {
        this.updateCurrentIndex();
      }
    }

    if (changes.currentSong) {
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

    if (changes.show) {
      if (!changes.show.firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();
        timer(80).subscribe(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }
          if (this.lyricRefs) {
            this.scrollToCurrentLyric(0);
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
      this.startLine = res.tlyric ? 1 : 2;
      this.handleLyric();
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

  private handleLyric() {
    this.lyric.handler.subscribe(({ lineNum }) => {
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
      }
      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        if (lineNum > this.startLine) {
          this.scrollToCurrentLyric(300);
        } else {
          this.wyScroll.last.scrollTo(0, 0);
        }
      }
    });
  }

  private scrollToCurrent(speed = 300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = songListRefs[this.currentIndex || 0] as HTMLElement;
      const offsetTop = currentLi.offsetTop;
      if (
        offsetTop - Math.abs(this.scrollY) > currentLi.offsetHeight * 5 ||
        offsetTop < Math.abs(this.scrollY)
      ) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }

  private scrollToCurrentLyric(speed = 300) {
    const targetLine = this.lyricRefs[this.currentLineNum - this.startLine];
    if (targetLine) {
      this.wyScroll.last.scrollToElement(targetLine, speed, false, false);
    }
  }

  toInfo(evt: MouseEvent, path: [string, number]) {
    evt.stopPropagation();
    this.onToInfo.emit(path);
  }

  likeSong(evt: MouseEvent, id: string) {
    evt.stopPropagation();
    this.onLikeSong.emit(id);
  }

  shareSong(evt: MouseEvent, song: Song) {
    evt.stopPropagation();
    this.onShareSong.emit(song);
  }
}
