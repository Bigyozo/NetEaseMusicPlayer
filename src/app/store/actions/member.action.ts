import { createAction, props } from '@ngrx/store';

import { ModalTypes, ShareInfo } from '../reducers/member.reducer';

export const SetModalVisible = createAction(
  '[member] Set modal visible',
  props<{ modalVisible: boolean }>()
);

export const SetModalType = createAction(
  '[member] Set modal type',
  props<{ modalType: ModalTypes }>()
);

export const SetUserId = createAction('[member] Set user Id', props<{ userId: string }>());
export const SetLikeId = createAction('[member] Set like Id', props<{ likeId: string }>());
export const SetShareInfo = createAction('[member] Set share info', props<{ info: ShareInfo }>());
