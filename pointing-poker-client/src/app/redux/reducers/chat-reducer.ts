import { createSlice } from '@reduxjs/toolkit';

interface IChatMessage {
  userId: string;
  message: string;
  time: '';
  messageId: string;
}

interface IChat {
  chatVisible: boolean;
  chatHistory: IChatMessage[];
  currentMessageValue: string;
}

const initialState: IChat = {
  chatVisible: false,
  chatHistory: [],
  currentMessageValue: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    showChatAction: (state) => {
      state.chatVisible = true;
    },
    closeChatAction: (state) => {
      state.chatVisible = false;
    },
    setMessagesAction: (state, action) => {
      state.chatHistory = action.payload.chatHistory;
    },
    setCurrentMessageValueAction: (state, action) => {
      state.currentMessageValue = action.payload;
    },
  },
});

export const {
  showChatAction,
  closeChatAction,
  setCurrentMessageValueAction,
  setMessagesAction,
} = chatSlice.actions;

export default chatSlice.reducer;
