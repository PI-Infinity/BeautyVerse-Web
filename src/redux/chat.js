import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChat: "",
  rerender: 1,
  counter: 30,
  scrollY: 500,
};

export const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    SetCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setRerender: (state, action) => {
      state.rerender++;
    },
    setCounter: (state, action) => {
      state.counter = action.payload;
    },
    setScrollY: (state, action) => {
      state.scrollY = action.payload;
    },
  },
});

export const { SetCurrentChat, setRerender, setCounter, setScrollY } =
  chat.actions;
export default chat.reducer;
