import { NzMessageService } from 'ng-zorro-antd';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { SearchResult } from './services/data.types/common.types';
import { User } from './services/data.types/member.type';
import { MemberService } from './services/member.service';
import { SearchService } from './services/search.service';
import { StorageService } from './services/storage.service';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { SetModalType, SetUserId } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { AppStoreModule } from './store/index';
import { codeJson } from './utils/base64';
import { isEmptyObject } from './utils/tools';

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
  wyRememberLogin: LoginParams;

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
    const wyRememberLogin = this.storgeService.getStorage('wyRememberLogin');
    if (wyRememberLogin) {
      this.wyRememberLogin = JSON.parse(wyRememberLogin);
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

  onLogin(params: LoginParams) {
    console.log(params);
    this.memberService.login(params).subscribe(
      (user) => {
        this.user = user;
        this.batchActionsService.controlModal(false);
        this.alertMessage('success', 'Login success');
        this.storgeService.setStorage({ key: 'wyUserID', value: user.profile.userId });
        this.store$.dispatch(SetUserId({ userId: user.profile.userId.toString() }));
        if (params.remember) {
          this.storgeService.setStorage({
            key: 'wyRememberLogin',
            value: JSON.stringify(codeJson(params))
          });
        } else {
          this.storgeService.removeStorge('wyRememberLogin');
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

  private alertMessage(type: string, msg: string) {
    this.messageService.create(type, msg);
  }
}
