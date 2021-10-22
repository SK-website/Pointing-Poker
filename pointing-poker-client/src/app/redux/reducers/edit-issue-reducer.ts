import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EditIssuePopupState {
  editIssuePopupVisible: boolean;
  idIssueToEdit: number | string;
}
const initialState: EditIssuePopupState = {
  editIssuePopupVisible: false,
  idIssueToEdit: '',
}

export const editIssuePopupSlice = createSlice({
  name: 'editIssuePopup',
  initialState,
  reducers: {
    showEditIssuePopupAction: (state) => {
      state.editIssuePopupVisible = true;
    },
    closeEditIssuePopupAction: (state) => {
      state.editIssuePopupVisible = false;
    },
    saveIdIssueToEditAction: (state, action: PayloadAction<string | number>) => {
      state.idIssueToEdit = action.payload;
    },
  },
});

export const { showEditIssuePopupAction, closeEditIssuePopupAction, saveIdIssueToEditAction } = editIssuePopupSlice.actions;

export default editIssuePopupSlice.reducer;
