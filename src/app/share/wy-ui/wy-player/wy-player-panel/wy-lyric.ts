import { Lyric } from 'src/app/services/data.types/common.types';

const timeExp = /\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]/;

export interface BaseLyricLine {
  txt: string;
  txtCn: string;
}

interface LyricLine extends BaseLyricLine {
  time: number;
}

export class WyLyric {
  private lrc: Lyric;
  lines: LyricLine[] = [];

  constructor(lrc: Lyric) {
    this.lrc = lrc;
    this.init();
  }

  private init() {
    if (this.lrc.tlyric) {
      this.generateTLyric();
    } else {
    }
    this.generateLyric();
  }
  private generateLyric() {
    let lines = this.lrc.lyric.split('\n');
    lines.forEach((line) => this.lineProcess(line));
  }

  private lineProcess(line: string): void {
    const result = timeExp.exec(line);
    console.log(result);
    if (result) {
      const txt = line.replace(timeExp, '').trim();
      const txtCn = '';
      if (txt) {
        let thirdResult = result[3] || '00';
        const len = thirdResult.length;
        let _thirdResult =
          len > 2 ? parseInt(thirdResult) : parseInt(thirdResult) * 10;
        const time =
          Number(result[1]) * 60 * 1000 +
          Number(result[2]) * 1000 +
          _thirdResult;
        this.lines.push({ txt, txtCn, time });
      }
    }
  }
  private generateTLyric() {}
}
