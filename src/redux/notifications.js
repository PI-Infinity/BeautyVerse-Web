import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scrollY: 0,
  rerenderNotifications: false,
  notifications: [],
  unreadNotifications: 0,
};

export const Notifications = createSlice({
  name: 'Notifications',
  initialState,

  reducers: {
    setScrollYNotifications: (state, action) => {
      state.scrollY = action.payload;
    },
    setRerenderNotifications: (state, action) => {
      state.rerenderNotifications = !state.rerenderNotifications;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnreadNotidications: (state, action) => {
      state.unreadNotifications = action.payload;
    },
  },
});

export const {
  setScrollYNotifications,
  setRerenderNotifications,
  setNotifications,
  setUnreadNotidications,
} = Notifications.actions;
export default Notifications.reducer;
