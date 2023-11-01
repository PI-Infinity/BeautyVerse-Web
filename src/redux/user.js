import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  targetUser: null,
  targetUserVisit: null,
  loading: false,
  rerenderCurrentUser: false,
  scrollY: 0,
};

export const User = createSlice({
  name: 'User',
  initialState,

  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setTargetUser: (state, action) => {
      state.targetUser = action.payload;
    },
    setTargetUserVisit: (state, action) => {
      state.targetUserVisit = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRerenderCurrentUser: (state, action) => {
      state.rerenderCurrentUser = !state.rerenderCurrentUser;
    },
    setScrollYUser: (state, action) => {
      state.scrollY = action.payload;
    },
  },
});

export const {
  setCurrentUser,
  setTargetUser,
  setTargetUserVisit,
  setLoading,
  setRerenderCurrentUser,
  setScrollYUser,
} = User.actions;
export default User.reducer;
