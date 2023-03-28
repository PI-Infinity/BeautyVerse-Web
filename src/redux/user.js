import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  targetUser: null,
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTargetUser: (state, action) => {
      state.targetUser = action.payload;
    },
    setTargetUserName: (state, action) => {
      state.targetUser.name = action.payload;
    },
    setTargetUsername: (state, action) => {
      state.targetUser.username = action.payload;
    },
    setTargetUserAddress: (state, action) => {
      state.targetUser.address[action.payload.index] = action.payload.data;
    },
    setTargetUserAddressRemove: (state, action) => {
      state.targetUser.address = state.targetUser.address.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const {
  setTargetUser,
  setTargetUserName,
  setTargetUsername,
  setTargetUserAddress,
  setTargetUserAddressRemove,
} = user.actions;
export default user.reducer;
