import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface Issue {
  id: number | string;
  title: string;
  link: string;
  priority: string;
  status: 'current' | 'resolved' | 'awaiting' | 'next';
}

interface AverageValue {
  value: string;
  percents: number;
}

interface Vote {
  memberId: string;
  value: string;
}

interface GameState {
  currentIssue: Issue;
  showRestartControls: boolean;
  currentTimer: { minutes: number; seconds: number };
  roundStatus: 'in progress' | 'awaiting';
  votes: Vote[];
  averageValues: AverageValue[];
  statistics: { issue: Issue; votes: Vote[]; averageValues: AverageValue[] }[];
  chosenCard: string;
}

const initialState: GameState = {
  currentIssue: {
    id: '',
    title: '',
    link: '',
    priority: 'low',
    status: 'awaiting',
  },
  showRestartControls: false,
  currentTimer: { minutes: 0, seconds: 0 },
  roundStatus: 'awaiting',
  votes: [],
  averageValues: [],
  statistics: [],
  chosenCard: '',
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentIssueAction: (state, action) => {
      state.currentIssue = action.payload;
    },
    stopRoundAction: (state, action) => ({ ...state, ...action.payload }),

    startRoundAction: (state, action) => ({ ...state, ...action.payload }),

    finishRoundAction: (state, action) => ({ ...state, ...action.payload }),

    setCurrentTimer: (state, action) => {
      state.currentTimer = action.payload;
    },
    addVoteAction: (state, action) => {
      state.votes = action.payload;
    },

    changeVoteAction: (state, action) => ({ ...state, ...action.payload }),

    setAverageValuesAction: (state, action) => {
      state.averageValues = action.payload;
    },
    addRoundInStatisticsAction: (state, action) => {
      state.statistics = action.payload;
    },
    setGameAction: (state, action) => ({ ...state, ...action.payload }),
    setChosenCard: (state, action) => {
      state.chosenCard = action.payload;
    },
  },
});

export const {
  startRoundAction,
  finishRoundAction,
  setCurrentIssueAction,
  stopRoundAction,
  setCurrentTimer,
  addVoteAction,
  setAverageValuesAction,
  addRoundInStatisticsAction,
  setGameAction,
  setChosenCard,
} = gameSlice.actions;

export const gameState = (state: RootState): GameState => state.game;

export default gameSlice.reducer;
