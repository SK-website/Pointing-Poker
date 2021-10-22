import { createSlice } from '@reduxjs/toolkit';

interface AdmitState {
  admitPopupVisibility: boolean;
  id: string;
  firstName: string;
  lastName: string;
  jobPosition: string;
}

const initialState: AdmitState = {
  admitPopupVisibility: false,
  id: '',
  firstName: '',
  lastName: '',
  jobPosition: '',
};

export const admitSlice = createSlice({
  name: 'admit',
  initialState,
  reducers: {
    showAdmitPopupAction: (state, action) => {
      state.admitPopupVisibility = true;
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.jobPosition = action.payload.jobPosition;
    },
    closeAdmitPopupAction: (state) => {
      state.admitPopupVisibility = false;
    },
  },
});

export const { showAdmitPopupAction, closeAdmitPopupAction } =
  admitSlice.actions;

export default admitSlice.reducer;
