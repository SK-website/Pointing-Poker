import { createSlice } from '@reduxjs/toolkit';

interface AuthPopupState {
  alertGameExistVisible: boolean;
  alertKickedVisible: boolean;
  authPopupVisible: boolean;
  gameID: string;
  newGame: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    jobPosition: string;
    isAdmin: boolean;
    role: 'observer' | 'player';
    voteResult?: string;
    kickCounter: number;
  };
}

const initialState: AuthPopupState = {
  alertGameExistVisible: false,
  alertKickedVisible: false,
  authPopupVisible: false,
  gameID: '',
  newGame: false,
  user: {
    id: '',
    firstName: '',
    lastName: '',
    jobPosition: '',
    isAdmin: false,
    role: 'player',
    voteResult: '',
    kickCounter: 0,
  },
};

export const authPopupSlice = createSlice({
  name: 'authPopup',
  initialState,
  reducers: {
    showAlertAction: (state) => {
      state.alertGameExistVisible = true;
    },
    closeAlertAction: (state) => {
      state.alertGameExistVisible = false;
    },
    showAlertKickedAction: (state) => {
      state.alertKickedVisible = true;
    },
    closeAlertKickedAction: (state) => {
      state.alertKickedVisible = false;
    },
    showAuthPopupAction: (state) => {
      state.authPopupVisible = true;
    },
    closeAuthPopupAction: (state) => {
      state.authPopupVisible = false;
      state.gameID = '';
      state.user = {
        id: '',
        firstName: '',
        lastName: '',
        jobPosition: '',
        isAdmin: false,
        role: 'player',
        voteResult: '',
        kickCounter: 0,
      };
    },
    setGameIDAction: (state, action) => {
      state.gameID = action.payload;
    },
    setNewGame: (state, action) => {
      state.newGame = action.payload;
    },
    setUserIDAction: (state, action) => {
      state.user.id = action.payload;
    },

    setFirstNameAction: (state, action) => {
      state.user.firstName = action.payload;
    },
    setLastNameAction: (state, action) => {
      state.user.lastName = action.payload;
    },
    setJobPositionAction: (state, action) => {
      state.user.jobPosition = action.payload;
    },
    setIsAdminAction: (state, action) => {
      state.user.isAdmin = action.payload;
    },
    setRoleAction: (state, action) => {
      state.user.role = action.payload;
    },
  },
});

export const {
  showAlertAction,
  closeAlertAction,
  showAlertKickedAction,
  closeAlertKickedAction,
  showAuthPopupAction,
  closeAuthPopupAction,
  setGameIDAction,
  setNewGame,
  setUserIDAction,
  setFirstNameAction,
  setLastNameAction,
  setJobPositionAction,
  setIsAdminAction,
  setRoleAction,
} = authPopupSlice.actions;

export default authPopupSlice.reducer;
