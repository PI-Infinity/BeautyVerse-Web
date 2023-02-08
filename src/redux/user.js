import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contentChanger: "posts",
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setContentChanger: (state, action) => {
      state.contentChanger = action.payload;
    },
  },
});

export const { setContentChanger } = user.actions;
export default user.reducer;
