import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rerenderUserList: false,
  rerenderCurrentUser: false,
  rerenderNotifications: false,
};

export const rerenders = createSlice({
  name: 'rerenders',
  initialState,
  reducers: {
    setRerenderUserList: (state, action) => {
      state.rerenderUserList = !state.rerenderUserList;
    },
    setRerenderCurrentUser: (state, action) => {
      state.rerenderCurrentUser = !state.rerenderCurrentUser;
    },
    setRerenderNotifications: (state, action) => {
      state.rerenderNotifications = !state.rerenderNotifications;
    },
  },
});

export const {
  setRerenderUserList,
  setRerenderCurrentUser,
  setRerenderNotifications,
} = rerenders.actions;
export default rerenders.reducer;
