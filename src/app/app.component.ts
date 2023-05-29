import { NzMessageService } from 'ng-zorro-antd';
import { interval, Observable } from 'rxjs';
import { filter, map, mergeMap, takeUntil } from 'rxjs/internal/operators';
import { MemberState, ModalTypes, ShareInfo } from 'src/app/store/reducers/member.reducer';

import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { LANGUAGE_CH } from './language/ch';
import { LanguageRes, SearchResult, SongSheet } from './services/data.types/common.types';
import { EmailLoginParams, PhoneLoginParams, User } from './services/data.types/member.type';
import { LanguageService } from './services/language.service';
import { LikeSongParams, MemberService, ShareParams } from './services/member.service';
import { SearchService } from './services/search.service';
import { StorageService } from './services/storage.service';
import { SetModalType, SetModalVisible, SetUserId } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { AppStoreModule } from './store/index';
import {
    getLikeId, getModalType, getModalVisible, getShareInfo
} from './store/selectors/member.selectors';
import { codeJson } from './utils/base64';
import { isEmptyObject } from './utils/tools';

interface StateArrType {
  type: any;
  cb: (param: any) => void;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  lanRes: LanguageRes = LANGUAGE_CH;
  title = 'MusicPlayer by Bigyozo';
  menu = [
    {
      label: '发现',
      path: '/home'
    },
    {
      label: '歌单',
      path: '/sheet'
    }
  ];

  languages = [
    { label: '中文', code: 'ch' },
    { label: 'English', code: 'en' }
  ];

  searchResult: SearchResult;
  user: User;
  wyRememberPhoneLogin: PhoneLoginParams;
  wyRememberEmailLogin: EmailLoginParams;
  mySheets: SongSheet[];
  // 被收藏歌曲ID
  likeId: string;
  // 弹框显示
  visible: boolean;
  // 弹窗loading
  showSpin = false;
  currentModalType: ModalTypes = ModalTypes.Default;
  shareInfo: ShareInfo;
  routeTitle = '';
  loadPercent = 0;
  private navEnd: Observable<NavigationEnd>;

  constructor(
    private searchService: SearchService,
    private store$: Store<AppStoreModule>,
    private batchActionsService: BatchActionsService,
    private memberService: MemberService,
    private messageService: NzMessageService,
    private storgeService: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleSerivce: Title,
    private languageService: LanguageService,
    @Inject(DOCUMENT) private doc: Document
  ) {
    const userId = this.storgeService.getStorage('wyUserID');
    if (userId) {
      this.memberService.getUserDetail(userId).subscribe((user) => {
        this.user = user;
      });
      this.store$.dispatch(SetUserId({ userId }));
    }
    const wyRememberPhoneLogin = this.storgeService.getStorage('wyRememberPhoneLogin');
    if (wyRememberPhoneLogin) {
      this.wyRememberPhoneLogin = JSON.parse(wyRememberPhoneLogin);
    }
    const wyRememberEmailLogin = this.storgeService.getStorage('wyRememberEmailLogin');
    if (wyRememberEmailLogin) {
      this.wyRememberEmailLogin = JSON.parse(wyRememberEmailLogin);
    }
    this.listenStates();

    this.router.events.pipe(filter((evt) => evt instanceof NavigationStart)).subscribe(() => {
      this.loadPercent = 0;
      this.setTitle();
    });
    this.navEnd = this.router.events.pipe(
      filter((evt) => evt instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;
    this.setLoadIngBar();
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
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
        mergeMap((route) => route.data)
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
      });
    this.navEnd.subscribe(() => {
      this.loadPercent = 100;
      //  this.doc.documentElement.scrollTop = 0;
    });
  }

  private listenStates() {
    const appStore$ = this.store$.pipe(select(createFeatureSelector<MemberState>('member')));
    const stateArr: StateArrType[] = [
      {
        type: getLikeId,
        cb: (id) => this.watchLikeId(id)
      },
      {
        type: getModalVisible,
        cb: (visible) => this.watchModalVisible(visible)
      },
      {
        type: getModalType,
        cb: (type) => this.watchModalType(type)
      },
      {
        type: getShareInfo,
        cb: (info) => this.watchShareInfo(info)
      }
    ];

    stateArr.forEach((item) => {
      appStore$.pipe(select(item.type)).subscribe(item.cb);
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

  private watchLikeId(id: any) {
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
    this.store$.dispatch(SetModalType({ modalType: type }));
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
        //Login success
        this.alertMessage('success', this.lanRes.C00076);
        this.storgeService.setStorage({ key: 'wyUserID', value: user.profile.userId });
        this.store$.dispatch(SetUserId({ userId: user.profile.userId.toString() }));
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
        //Login fail
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
        //  this.storgeService.setStorage({ key: 'cookie', value: user.cookie });
        this.store$.dispatch(SetUserId({ userId: user.profile.userId.toString() }));
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
        //'Login fail'
        this.alertMessage('error', error.message || this.lanRes.C00077);
      }
    );
  }

  onLogout() {
    this.memberService.logout().subscribe(
      () => {
        this.user = null;
        this.storgeService.removeStorge('wyUserID');
        //  this.storgeService.removeStorge('cookie');
        this.store$.dispatch(SetUserId({ userId: '' }));
        this.alertMessage('success', 'Logout success');
      },
      (error) => {
        //'Login fail'
        this.alertMessage('error', error.message || this.lanRes.C00077);
      }
    );
  }

  // 获取当前用户的歌单
  onLoadMySheets() {
    if (this.user) {
      this.memberService
        .getUserSheets(this.user.profile.userId.toString())
        .subscribe((userSheet) => {
          this.mySheets = userSheet.self;
          this.store$.dispatch(SetModalVisible({ modalVisible: true }));
        });
    } else {
      this.openModal(ModalTypes.Default);
    }
  }

  // 收藏歌曲
  onLikeSong(args: LikeSongParams) {
    this.memberService.likeSong(args).subscribe(
      () => {
        this.batchActionsService.controlModal(false);
        //Collect success
        this.alertMessage('success', this.lanRes.C00078);
      },
      (error) => {
        //Collect fail
        this.alertMessage('error', error.msg || this.lanRes.C00079);
      }
    );
  }

  onCreateSheet(sheetName: string) {
    this.memberService.createSheet(sheetName).subscribe(
      (pid) => {
        this.onLikeSong({ pid, tracks: this.likeId });
      },
      (error) => {
        //Create fail
        this.alertMessage('error', error.msg || this.lanRes.C00080);
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
        //Share succes
        this.alertMessage('success', this.lanRes.C00081);
      },
      (error) => {
        //Share fail
        this.alertMessage('error', error.msg || this.lanRes.C00082);
      }
    );
  }

  // 注册账号
  onRegister(phone: string) {
    //not support register
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
