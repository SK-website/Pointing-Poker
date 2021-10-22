import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface KickPopupState {
  kickPopupVisible: boolean;
  kickedMemberId: string;
  membersKickedByCurrentUser: string[];
}

const initialState: KickPopupState = {
  kickPopupVisible: false,
  kickedMemberId: '',
  membersKickedByCurrentUser: [],

};

export const kickPopupSlice = createSlice({
  name: 'kickPopup',
  initialState,
  reducers: {
    showKickPopupAction: (state, action: PayloadAction<string>) => {
      state.kickPopupVisible = true;
      state.kickedMemberId = action.payload;
    },
    closeKickPopupAction: (state) => {
      state.kickPopupVisible = false;
      state.kickedMemberId = '';
    },
    addKickedByUserMemberIdAction: (state, action: PayloadAction<string>) => {
      state.membersKickedByCurrentUser.push(action.payload)
    },
  },
});

export const { showKickPopupAction, closeKickPopupAction, addKickedByUserMemberIdAction } =
  kickPopupSlice.actions;

export const kickPopupVisible = (state: RootState): boolean =>
  state.kickPopup.kickPopupVisible;

export default kickPopupSlice.reducer;
