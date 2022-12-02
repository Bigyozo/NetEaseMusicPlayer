import { Action, createReducer, on } from '@ngrx/store';

import { SetModalType, SetModalVisible } from '../actions/member.action';

export enum ModalTypes {
  Register = 'register',
  LogingByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  Default = 'default'
}

export type MemberState = {
  modalVisible: boolean;
  modalType: ModalTypes;
};

export const initialState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default
};

const reducer = createReducer(
  initialState,
  on(SetModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
  on(SetModalType, (state, { modalType }) => ({ ...state, modalType }))
);

export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action);
}
