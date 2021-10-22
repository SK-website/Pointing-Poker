import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CardValue {
  id: string;
  name: string;
  values: string[];
}

export interface AddCardValues {
  addCardValuePopupVisible: boolean;
  setOwnCardValuePopupVisible: boolean;
  cardValues: CardValue[];
  currCardValue: string,
  cardsSelected: string[],
  valueIsInSelected: boolean,
}

const initialState: AddCardValues = {
  addCardValuePopupVisible: false,
  setOwnCardValuePopupVisible: false,
  cardValues: [
    { id: 'FB', name: 'FB', values: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', 'Pass', 'Break'] },
    { id: 'SP', name: 'SP', values: ['0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', 'Pass', 'Break'] },
    { id: 'P2', name: 'P2', values: ['0', '1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '?', 'Pass', 'Break'] },
    { id: 'OS', name: 'OS', values: [] },
  ],
  currCardValue: '0',
  cardsSelected: ['0'],
  valueIsInSelected: false,
}

export const addCardValuesSlice = createSlice({
  name: 'addCardValues',
  initialState,
  reducers: {
    showAddCardValuePopupAction: (state) => {
      state.addCardValuePopupVisible = true;
    },
    showSetOwnCardPopupAction: (state) => {
      state.setOwnCardValuePopupVisible = true;
    },
    closeAddCardValuePopupAction: (state) => {
      state.addCardValuePopupVisible = false;
      state.valueIsInSelected = false;
      state.currCardValue = '0';
    },
    closeSetOwnCardValuePopupAction: (state) => {
      state.setOwnCardValuePopupVisible = false;
      state.valueIsInSelected = false;
      state.currCardValue = '';
    },
    saveCurrCardValueAction: (state, action: PayloadAction<string>) => {
      state.currCardValue = action.payload;
    },
    addNewCardValueAction: (state) => {
      state.cardsSelected.push(state.currCardValue);
      state.addCardValuePopupVisible = false;
      state.currCardValue = '0';
    },
    setOwnCardValueAction: (state) => {
      state.cardsSelected.push(state.currCardValue);
      state.setOwnCardValuePopupVisible = false;
      state.currCardValue = '';
    },
    setCardsFromDefaultSettings: (state, action: PayloadAction<Array<string>>) => {
      state.cardsSelected = action.payload;
    },
    valueIsInSelectedAction: (state, action: PayloadAction<boolean>) => {
      state.valueIsInSelected = action.payload;
    },
    cleanCardsSelectedAction: (state) => {
      state.cardsSelected = ['0'];
      state.valueIsInSelected = false;
    }
  }
});

export const { showAddCardValuePopupAction, closeAddCardValuePopupAction, saveCurrCardValueAction, addNewCardValueAction, cleanCardsSelectedAction, showSetOwnCardPopupAction, closeSetOwnCardValuePopupAction, setOwnCardValueAction, valueIsInSelectedAction, setCardsFromDefaultSettings } = addCardValuesSlice.actions;

export default addCardValuesSlice.reducer;
