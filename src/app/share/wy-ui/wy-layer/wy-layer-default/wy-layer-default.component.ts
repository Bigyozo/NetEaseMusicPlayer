import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageRes } from 'src/app/services/data.types/common.types';
import { LanguageService } from 'src/app/services/language.service';
import { ImgDefaultDirective } from '../../../directives/img-default.directive';

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect, output
} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  standalone: true,
  imports: [NzButtonModule, ImgDefaultDirective],
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
              <!-- 電話番号でログイン -->
              {{ lanRes.C00005 }}
            </button>
            <button
              nz-button
              nzType="primary"
              nzSize="large"
              nzBlock
              (click)="onChangeModalType.emit('loginByEmail')"
            >
              <!-- メールアドレスでログイン -->
              {{ lanRes.C00006 }}
            </button>
            <button nz-button nzSize="large" nzBlock (click)="onChangeModalType.emit('register')">
              <!-- 登録 -->
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
  lanRes: LanguageRes = LANGUAGE_JP;
  onChangeModalType = output<string | void>();
  constructor(private languageService: LanguageService, private cdr: ChangeDetectorRef) {
    effect(() => {
      this.lanRes = this.languageService.language().res;
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {}
}
