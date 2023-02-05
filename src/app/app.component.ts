import { NzMessageService } from 'ng-zorro-antd';
import { MemberState, ModalTypes, ShareInfo } from 'src/app/store/reducers/member.reducer';

import { Component } from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { SearchResult, SongSheet } from './services/data.types/common.types';
import { EmailLoginParams, PhoneLoginParams, User } from './services/data.types/member.type';
import { LikeSongParams, MemberService } from './services/member.service';
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

type StateArrType = {
  type: any;
  cb: (param: any) => void;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
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

  searchResult: SearchResult;
  user: User;
  wyRememberPhoneLogin: PhoneLoginParams;
  wyRememberEmailLogin: EmailLoginParams;
  mySheets: SongSheet[];

  //被收藏歌曲ID
  likeId: string;
  //弹框显示
  visible: boolean;
  currentModalType: ModalTypes = ModalTypes.Default;
  shareInfo: ShareInfo;

  constructor(
    private searchService: SearchService,
    private store$: Store<AppStoreModule>,
    private batchActionsService: BatchActionsService,
    private memberService: MemberService,
    private messageService: NzMessageService,
    private storgeService: StorageService
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
      this.shareInfo = info;
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

  openModal(type: ModalTypes) {
    this.batchActionsService.controlModal(true, type);
  }

  onPhoneLogin(params: PhoneLoginParams) {
    console.log(params);
    this.memberService.phoneLogin(params).subscribe(
      (user) => {
        this.user = user;
        this.batchActionsService.controlModal(false);
        this.alertMessage('success', 'Login success');
        this.storgeService.setStorage({ key: 'wyUserID', value: user.profile.userId });
        this.store$.dispatch(SetUserId({ userId: user.profile.userId.toString() }));
        if (params.remember) {
          this.storgeService.setStorage({
            key: 'wyRememberPhoneLogin',
            value: JSON.stringify(codeJson(params))
          });
        } else {
          this.storgeService.removeStorge('wyRememberPhoneLogin');
        }
      },
      (error) => {
        this.alertMessage('error', error.message || 'Login fail');
      }
    );
  }

  onEmailLogin(params: EmailLoginParams) {
    console.log(params);
    this.memberService.emailLogin(params).subscribe(
      (user) => {
        this.user = user;
        this.batchActionsService.controlModal(false);
        this.alertMessage('success', 'Login success');
        this.storgeService.setStorage({ key: 'wyUserID', value: user.profile.userId });
        this.store$.dispatch(SetUserId({ userId: user.profile.userId.toString() }));
        if (params.remember) {
          this.storgeService.setStorage({
            key: 'wyRememberEmailLogin',
            value: JSON.stringify(codeJson(params))
          });
        } else {
          this.storgeService.removeStorge('wyRememberEmailLogin');
        }
      },
      (error) => {
        this.alertMessage('error', error.message || 'Login fail');
      }
    );
  }

  onLogout() {
    this.memberService.logout().subscribe(
      () => {
        this.user = null;
        this.storgeService.removeStorge('wyUserID');
        this.store$.dispatch(SetUserId({ userId: '' }));
        this.alertMessage('success', 'Logout success');
      },
      (error) => {
        this.alertMessage('error', error.message || 'Logout fail');
      }
    );
  }

  //获取当前用户的歌单
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

  //收藏歌曲
  onLikeSong(args: LikeSongParams) {
    this.memberService.likeSong(args).subscribe(
      () => {
        this.batchActionsService.controlModal(false);
        this.alertMessage('success', '收藏成功');
      },
      (error) => {
        this.alertMessage('error', error.msg || '收藏失败');
      }
    );
  }

  onCreateSheet(sheetName: string) {
    this.memberService.createSheet(sheetName).subscribe(
      (pid) => {
        this.onLikeSong({ pid, tracks: this.likeId });
      },
      (error) => {
        this.alertMessage('error', error.msg || '新建失败');
      }
    );
  }

  private alertMessage(type: string, msg: string) {
    this.messageService.create(type, msg);
  }
}
