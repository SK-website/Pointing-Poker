import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameSettingsState {
  cardChange: boolean;
  timerOn: boolean;
  allowEnterInGame: boolean;
  cardsAutoTurn: boolean;
  scoreType: string;
  scoreTypeShort: string;
  timerMinutes: string;
  timerSeconds: string;
  cardCover: string;
  cardValuesFinalSet: string[];
  isDefaultSettings: boolean;
}

const initialState: GameSettingsState = {
  cardChange: false,
  timerOn: false,
  allowEnterInGame: false,
  cardsAutoTurn: false,
  scoreType: 'FB',
  scoreTypeShort: 'FB',
  timerMinutes: '00',
  timerSeconds: '00',
  cardCover: '#E42B77',
  cardValuesFinalSet: [
    '0',
    '1',
    '2',
    '3',
    '5',
    '8',
    '13',
    '21',
    '34',
    '55',
    '89',
    '?',
    'Pass',
    'Break',
  ],
  isDefaultSettings: false,
};

export const gameSettingsSlice = createSlice({
  name: 'gameSettings',
  initialState,
  reducers: {
    cardChangeAction: (state) => {
      state.cardChange = !state.cardChange;
    },
    timerOnAction: (state) => {
      state.timerOn = !state.timerOn;
    },
    allowEnterInGameAction: (state) => {
      state.allowEnterInGame = !state.allowEnterInGame;
    },
    cardsAutoTurnAction: (state) => {
      state.cardsAutoTurn = !state.cardsAutoTurn;
    },
    scoreTypeAction: (state, action: PayloadAction<string>) => {
      state.scoreType = action.payload;
      state.scoreTypeShort = action.payload;
    },
    scoreTypeShortAction: (state, action: PayloadAction<string>) => {
      state.scoreTypeShort = action.payload;
      state.scoreType = action.payload;
    },
    timerMinutesAction: (state, action: PayloadAction<string>) => {
      state.timerMinutes = action.payload;
    },
    timerSecondsAction: (state, action: PayloadAction<string>) => {
      state.timerSeconds = action.payload;
    },
    saveCardCoverAction: (state, action: PayloadAction<string>) => {
      state.cardCover = action.payload;
    },
    setCardValuesFinalSetAction: (
      state,
      action: PayloadAction<Array<string>>
    ) => {
      state.cardValuesFinalSet = action.payload;
    },
    setDefaultSettings: (state) => {
      state.isDefaultSettings = !state.isDefaultSettings;
    },
    setGameSettings: (state, action: PayloadAction<GameSettingsState>) => {
      state.cardChange = action.payload.cardChange;
      state.timerOn = action.payload.timerOn;
      state.allowEnterInGame = action.payload.allowEnterInGame;
      state.cardsAutoTurn = action.payload.cardsAutoTurn;
      state.scoreType = action.payload.scoreType;
      state.scoreTypeShort = action.payload.scoreTypeShort;
      state.timerMinutes = action.payload.timerMinutes;
      state.timerSeconds = action.payload.timerSeconds;
      state.cardCover = action.payload.cardCover;
      state.cardValuesFinalSet = action.payload.cardValuesFinalSet;
      state.isDefaultSettings = false;
    },
  },
});

export const {
  cardChangeAction,
  timerOnAction,
  allowEnterInGameAction,
  cardsAutoTurnAction,
  scoreTypeAction,
  scoreTypeShortAction,
  timerMinutesAction,
  timerSecondsAction,
  saveCardCoverAction,
  setCardValuesFinalSetAction,
  setDefaultSettings,
  setGameSettings,
} = gameSettingsSlice.actions;

export default gameSettingsSlice.reducer;
