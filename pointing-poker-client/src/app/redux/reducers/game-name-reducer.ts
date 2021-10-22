import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface EditNamePopupState {
	editNamePopupVisible: boolean;
	gameName: string;
	prevGameName: string;
}

const initialState: EditNamePopupState = {
	editNamePopupVisible: false,
	gameName: 'New Game Name',
	prevGameName: '',
};

export const editNamePopupSlice = createSlice({
	name: 'gameName',
	initialState,
	reducers: {
		showEditNamePopupAction: (state) => {
			state.editNamePopupVisible = true;
		},
		closeEditNamePopupAction: (state) => {
			state.editNamePopupVisible = false;
		},
		savePrevGameNameAction: (state) => {
			state.prevGameName = state.gameName;
		},
		saveNewGameNameAction: (state, action: PayloadAction<string>) => {
			state.gameName = action.payload;
		}
	},
});

export const { showEditNamePopupAction, closeEditNamePopupAction, saveNewGameNameAction, savePrevGameNameAction } = editNamePopupSlice.actions;

export const editNamePopupVisible = (state: RootState): boolean =>
	state.gameName.editNamePopupVisible;

export default editNamePopupSlice.reducer;
