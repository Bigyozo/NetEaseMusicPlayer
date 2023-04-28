import { LANGUAGE_CH } from 'src/app/language/ch';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output
} from '@angular/core';

@Component({
  selector: 'app-wy-layer-default',
  template: `
    <div class="cnzt">
      <div class="select-log">
        <div class="mid-wrap">
          <div class="pic">
            <img appImgDefault src="../../../../../assets/images/platform.png" />
          </div>
          <div class="methods">
            <button
              nz-button
              nzSize="large"
              nzBlock
              (click)="onChangeModalType.emit('loginByPhone')"
            >
              <!-- 手机登陆 -->
              {{ lanRes.C00005 }}
            </button>
            <button
              nz-button
              nzType="primary"
              nzSize="large"
              nzBlock
              (click)="onChangeModalType.emit('loginByEmail')"
            >
              <!-- 邮箱登陆 -->
              {{ lanRes.C00006 }}
            </button>
            <button nz-button nzSize="large" nzBlock (click)="onChangeModalType.emit('register')">
              <!-- 注册 -->
              {{ lanRes.C00007 }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./wy-layer-default.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerDefaultComponent implements OnInit {
  lanRes: LanguageRes = LANGUAGE_CH;
  @Output() onChangeModalType = new EventEmitter<string | void>();
  constructor(private languageService: LanguageService, private cdr: ChangeDetectorRef) {
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {}
}
