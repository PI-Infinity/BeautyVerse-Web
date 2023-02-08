import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // define scroll position for header animation
  scroll: false,
  // define scroll position for go back button, to save old position
  scorllPosition: 0,
  goBack: false,
};

export const scroll = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    setScroll: (state, action) => {
      state.scroll = action.payload;
    },
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
    setGoBack: (state, action) => {
      state.goBack = action.payload;
    },
  },
});

export const { setScroll, setScrollPosition, setGoBack } = scroll.actions;
export default scroll.reducer;
