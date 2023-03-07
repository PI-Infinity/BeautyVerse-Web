import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // define scroll position for header animation
  scroll: false,
  // define scroll position for go back button, to save old position
  feedScrollY: 0,
  cardsScrollY: 0,
  goBack: false,
};

export const scroll = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    setScroll: (state, action) => {
      state.scroll = action.payload;
    },
    setFeedScrollY: (state, action) => {
      state.feedScrollY = action.payload;
    },
    setCardsScrollY: (state, action) => {
      state.cardsScrollY = action.payload;
    },
    setGoBack: (state, action) => {
      state.goBack = action.payload;
    },
  },
});

export const { setScroll, setFeedScrollY, setCardsScrollY, setGoBack } =
  scroll.actions;
export default scroll.reducer;
