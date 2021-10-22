import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DeleteIssuePopupState {
  deleteIssuePopupVisible: boolean;
  idIssueToDelete: number | string;
}
const initialState: DeleteIssuePopupState = {
  deleteIssuePopupVisible: false,
  idIssueToDelete: '',
};

export const deleteIssuePopupSlice = createSlice({
  name: 'deleteIssuePopup',
  initialState,
  reducers: {
    showDeleteIssuePopupAction: (state) => {
      state.deleteIssuePopupVisible = true;
    },
    closeDeleteIssuePopupAction: (state) => {
      state.deleteIssuePopupVisible = false;
    },
    saveIdIssueToDeleteAction: (
      state,
      action: PayloadAction<string | number>
    ) => {
      state.idIssueToDelete = action.payload;
    },
  },
});

export const {
  showDeleteIssuePopupAction,
  closeDeleteIssuePopupAction,
  saveIdIssueToDeleteAction,
} = deleteIssuePopupSlice.actions;

export default deleteIssuePopupSlice.reducer;
