import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scrollY: 0,
  rerenderNotifications: false,
  notifications: [],
  unreadNotifications: 0,
  page: 1,
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
    addNotifications: (state, action) => {
      const newNotifications = action.payload.filter(
        (newNotification) =>
          !state.notifications.some(
            (existingNotification) =>
              existingNotification._id === newNotification._id
          )
      );
      state.notifications.push(...newNotifications);
    },
    addUnreadNotifications: (state, action) => {
      const newUnreadNotifications = action.payload.filter(
        (newUnreadNotification) =>
          !state.unreadNotifications.some(
            (existingUnreadNotification) =>
              existingUnreadNotification._id === newUnreadNotification._id
          )
      );
      state.unreadNotifications.push(...newUnreadNotifications);
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const {
  setScrollYNotifications,
  setRerenderNotifications,
  setNotifications,
  setUnreadNotidications,
  setPage,
  addNotifications,
  addUnreadNotifications,
} = Notifications.actions;
export default Notifications.reducer;
