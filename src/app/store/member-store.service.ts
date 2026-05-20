import { Injectable, signal } from '@angular/core';

export enum ModalTypes {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  LoginByEmail = 'loginByEmail',
  Share = 'share',
  Like = 'like',
  Default = 'default'
}

export interface ShareInfo {
  id: string;
  type: string;
  txt: string;
}

@Injectable({ providedIn: 'root' })
export class MemberStoreService {
  readonly modalVisible = signal(false);
  readonly modalType = signal<ModalTypes>(ModalTypes.Default);
  readonly userId = signal('');
  readonly likeId = signal('');
  readonly shareInfo = signal<ShareInfo | undefined>(undefined);
}
