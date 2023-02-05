import { Action, createReducer, on } from '@ngrx/store';

import {
    SetLikeId, SetModalType, SetModalVisible, SetShareInfo, SetUserId
} from '../actions/member.action';

export enum ModalTypes {
  Register = 'register',
  LogingByPhone = 'loginByPhone',
  LogingByEmail = 'loginByEmail',
  Share = 'share',
  Like = 'like',
  Default = 'default'
}

export type ShareInfo = {
  id: string;
  type: string;
  txt: string;
};

export type MemberState = {
  modalVisible: boolean;
  modalType: ModalTypes;
  userId: string;
  likeId: string;
  shareInfo?: ShareInfo;
};

export const initialState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default,
  userId: '',
  likeId: ''
};

const reducer = createReducer(
  initialState,
  on(SetModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
  on(SetModalType, (state, { modalType }) => ({ ...state, modalType })),
  on(SetUserId, (state, { userId }) => ({ ...state, userId })),
  on(SetLikeId, (state, { likeId }) => ({ ...state, likeId })),
  on(SetShareInfo, (state, { info }) => ({ ...state, shareInfo: info }))
);

export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action);
}
