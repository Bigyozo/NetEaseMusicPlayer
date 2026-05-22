import { NzMessageService } from 'ng-zorro-antd/message';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { interval, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { WySearchComponent } from './share/wy-ui/wy-search/wy-search.component';
import { WyPlayerComponent } from './share/wy-ui/wy-player/wy-player.component';
import { WyLayerModalComponent } from './share/wy-ui/wy-layer/wy-layer-modal/wy-layer-modal.component';
import { WyLayerPhoneLoginComponent } from './share/wy-ui/wy-layer/wy-layer-phoneLogin/wy-layer-phoneLogin.component';
import { WyLayerEmailLoginComponent } from './share/wy-ui/wy-layer/wy-layer-emailLogin/wy-layer-emailLogin.component';
import { WyLayerLikeComponent } from './share/wy-ui/wy-layer/wy-layer-like/wy-layer-like.component';
import { WyLayerShareComponent } from './share/wy-ui/wy-layer/wy-layer-share/wy-layer-share.component';
import { WyLayerRegisterComponent } from './share/wy-ui/wy-layer/wy-layer-register/wy-layer-register.component';
import { WyLayerDefaultComponent } from './share/wy-ui/wy-layer/wy-layer-default/wy-layer-default.component';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';

import { LANGUAGE_JP } from './language/jp';
import { LanguageRes, SearchResult, SongSheet } from './services/data.types/common.types';
import { EmailLoginParams, PhoneLoginParams, User } from './services/data.types/member.type';
import { LanguageService } from './services/language.service';
import { LikeSongParams, MemberService, ShareParams } from './services/member.service';
import { SearchService } from './services/search.service';
import { StorageService } from './services/storage.service';
import { BatchActionsService } from './store/batch-actions.service';
import { MemberStoreService, ModalTypes, ShareInfo } from './store/member-store.service';
import { codeJson } from './utils/base64';
import { isEmptyObject } from './utils/tools';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzProgressModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzAvatarModule,
    NzFloatButtonModule,
    NzButtonModule,
    WySearchComponent,
    WyPlayerComponent,
    WyLayerModalComponent,
    WyLayerPhoneLoginComponent,
    WyLayerEmailLoginComponent,
    WyLayerLikeComponent,
    WyLayerShareComponent,
    WyLayerRegisterComponent,
    WyLayerDefaultComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  lanRes: LanguageRes = LANGUAGE_JP;
  title = 'MusicPlayer by Bigyozo';
  menu = [
    {
      label: '探索',
      path: '/home'
    },
    {
      label: 'ソングシート',
      path: '/sheet'
    }
  ];

  languages = [
    { label: '日本語', code: 'jp' },
    { label: 'English', code: 'en' }
  ];

  searchResult: SearchResult;
  user: User;
  wyRememberPhoneLogin: PhoneLoginParams;
  wyRememberEmailLogin: EmailLoginParams;
  mySheets: SongSheet[];
  likeId: string;
  visible: boolean;
  showSpin = false;
  currentModalType: ModalTypes = ModalTypes.Default;
  shareInfo: ShareInfo;
  routeTitle = '';
  loadPercent = 0;
  private navEnd: Observable<NavigationEnd>;
  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private memberStore: MemberStoreService,
    private batchActionsService: BatchActionsService,
    private memberService: MemberService,
    private messageService: NzMessageService,
    private storgeService: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleSerivce: Title,
    private languageService: LanguageService
  ) {
    const userId = this.storgeService.getStorage('wyUserID');
    if (userId) {
      this.memberService.getUserDetail(userId).subscribe((user) => {
        this.user = user;
      });
      this.memberStore.userId.set(userId);
    }
    const wyRememberPhoneLogin = this.storgeService.getStorage('wyRememberPhoneLogin');
    if (wyRememberPhoneLogin) {
      this.wyRememberPhoneLogin = JSON.parse(wyRememberPhoneLogin);
    }
    const wyRememberEmailLogin = this.storgeService.getStorage('wyRememberEmailLogin');
    if (wyRememberEmailLogin) {
      this.wyRememberEmailLogin = JSON.parse(wyRememberEmailLogin);
    }

    effect(() => this.watchLikeId(this.memberStore.likeId()));
    effect(() => this.watchModalVisible(this.memberStore.modalVisible()));
    effect(() => this.watchModalType(this.memberStore.modalType()));
    effect(() => this.watchShareInfo(this.memberStore.shareInfo()));

    this.router.events
      .pipe(filter((evt) => evt instanceof NavigationStart), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPercent = 0;
        this.setTitle();
      });
    this.navEnd = this.router.events.pipe(
      filter((evt) => evt instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;
    this.setLoadIngBar();
    effect(() => {
      this.lanRes = this.languageService.language().res;
      this.menu = [
        {
          label: this.lanRes.C00002,
          path: '/home'
        },
        {
          label: this.lanRes.C00003,
          path: '/sheet'
        }
      ];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setTitle() {
    this.navEnd
      .pipe(
        map(() => this.activatedRoute),
        map((route: ActivatedRoute) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.routeTitle = data.title;
        this.titleSerivce.setTitle(this.routeTitle);
      });
  }

  private setLoadIngBar() {
    interval(100)
      .pipe(takeUntil(this.navEnd))
      .subscribe(() => {
        this.loadPercent = Math.max(95, ++this.loadPercent);
        this.cdr.markForCheck();
      });
    this.navEnd.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadPercent = 100;
      this.cdr.markForCheck();
    });
  }

  private watchShareInfo(info: ShareInfo): void {
    if (info) {
      if (this.user) {
        this.shareInfo = info;
        this.openModal(ModalTypes.Share);
      } else {
        this.openModal(ModalTypes.Default);
      }
    }
  }

  private watchLikeId(id: string) {
    if (id) {
      this.likeId = id;
    }
  }

  private watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {
      if (type === ModalTypes.Like) {
        this.onLoadMySheets();
      }
      this.currentModalType = type;
    }
  }

  private watchModalVisible(visible: boolean) {
    if (this.visible !== visible) {
      this.visible = visible;
    }
  }

  onChangeLanguage(code: string) {
    this.languageService.changeLanguage(code);
  }

  onSearch(keywords: string) {
    if (keywords) {
      this.searchService.search(keywords).subscribe((res) => {
        this.searchResult = this.highlightKeyWord(keywords, res);
      });
    } else {
      this.searchResult = {};
    }
  }

  private highlightKeyWord(keywords: string, result: SearchResult): SearchResult {
    if (!isEmptyObject(result)) {
      const reg = new RegExp(keywords, 'ig');
      ['artists', 'playlists', 'songs'].forEach((type) => {
        if (result[type]) {
          result[type].forEach((element) => {
            element.name = element.name.replace(reg, '<span class="highlight">$&</span>');
          });
        }
      });
    }
    return result;
  }

  onChangeModalType(type = ModalTypes.Default) {
    this.memberStore.modalType.set(type);
  }

  openModal(type: ModalTypes, isOpen = true) {
    this.batchActionsService.controlModal(isOpen, type);
  }

  onPhoneLogin(params: PhoneLoginParams) {
    this.showSpin = true;
    this.memberService.phoneLogin(params).subscribe(
      (user) => {
        this.user = user;
        this.batchActionsService.controlModal(false);
        this.alertMessage('success', this.lanRes.C00076);
        this.storgeService.setStorage({ key: 'wyUserID', value: user.profile.userId });
        this.memberStore.userId.set(user.profile.userId.toString());
        if (params.remember) {
          this.storgeService.setStorage({
            key: 'wyRememberPhoneLogin',
            value: JSON.stringify(codeJson(params))
          });
        } else {
          this.showSpin = false;
          this.storgeService.removeStorge('wyRememberPhoneLogin');
        }
      },
      (error) => {
        this.showSpin = false;
        this.alertMessage('error', error.message || this.lanRes.C00077);
      }
    );
  }

  onEmailLogin(params: EmailLoginParams) {
    this.showSpin = true;
    this.memberService.emailLogin(params).subscribe(
      (user) => {
        this.user = user;
        this.batchActionsService.controlModal(false);
        this.alertMessage('success', 'Login success');
        this.storgeService.setStorage({ key: 'wyUserID', value: user.profile.userId });
        this.memberStore.userId.set(user.profile.userId.toString());
        if (params.remember) {
          this.storgeService.setStorage({
            key: 'wyRememberEmailLogin',
            value: JSON.stringify(codeJson(params))
          });
        } else {
          this.showSpin = false;
          this.storgeService.removeStorge('wyRememberEmailLogin');
        }
      },
      (error) => {
        this.showSpin = false;
        this.alertMessage('error', error.message || this.lanRes.C00077);
      }
    );
  }

  onLogout() {
    this.memberService.logout().subscribe(
      () => {
        this.user = null;
        this.storgeService.removeStorge('wyUserID');
        this.memberStore.userId.set('');
        this.alertMessage('success', 'Logout success');
      },
      (error) => {
        this.alertMessage('error', error.message || this.lanRes.C00077);
      }
    );
  }

  onLoadMySheets() {
    if (this.user) {
      this.memberService
        .getUserSheets(this.user.profile.userId.toString())
        .subscribe((userSheet) => {
          this.mySheets = userSheet.self;
          this.memberStore.modalVisible.set(true);
        });
    } else {
      this.openModal(ModalTypes.Default);
    }
  }

  onLikeSong(args: LikeSongParams) {
    this.memberService.likeSong(args).subscribe(
      () => {
        this.batchActionsService.controlModal(false);
        this.alertMessage('success', this.lanRes.C00078);
      },
      (error) => {
        this.alertMessage('error', error.message || this.lanRes.C00079);
      }
    );
  }

  onCreateSheet(sheetName: string) {
    this.memberService.createSheet(sheetName).subscribe(
      (pid) => {
        this.onLikeSong({ pid, tracks: this.likeId });
      },
      (error) => {
        this.alertMessage('error', error.message || this.lanRes.C00080);
      }
    );
  }

  onCancelShare() {
    this.openModal(ModalTypes.Share, false);
  }

  onShare(args: ShareParams) {
    this.memberService.shareResource(args).subscribe(
      () => {
        this.openModal(ModalTypes.Share, false);
        this.alertMessage('success', this.lanRes.C00081);
      },
      (error) => {
        this.alertMessage('error', error.message || this.lanRes.C00082);
      }
    );
  }

  onRegister(phone: string) {
    this.alertMessage('error', this.lanRes.C00083);
  }

  openModalByMenu(type: 'loginByPhone' | 'loginByEmail' | 'register') {
    if (type === 'loginByPhone') {
      this.openModal(ModalTypes.LoginByPhone);
    } else if (type === 'loginByEmail') {
      this.openModal(ModalTypes.LoginByEmail);
    } else {
      this.openModal(ModalTypes.Register);
    }
  }

  private alertMessage(type: string, msg: string) {
    this.messageService.create(type, msg);
  }
}
