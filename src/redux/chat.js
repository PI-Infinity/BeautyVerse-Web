import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: false,
  currentChat: '',
  userChats: [],
  counter: 30,
  scrollY: 500,
  rerenderChatList: false,
};

export const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setUserChats: (state, action) => {
      state.userChats = action.payload;
    },
    setCounter: (state, action) => {
      state.counter = action.payload;
    },
    setScrollY: (state, action) => {
      state.scrollY = action.payload;
    },
    setRerenderChatList: (state, action) => {
      state.rerenderChatList = !state.rerenderChatList;
    },
  },
});

export const {
  setActiveTab,
  setCurrentChat,
  setUserChats,
  setCounter,
  setScrollY,
  setRerenderChatList,
} = chat.actions;
export default chat.reducer;
