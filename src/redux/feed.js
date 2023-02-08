import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feeds: [],
  imgNumber: 0,
  stars: [],
  reviews: [],
  userId: "",
  userCover: null,
  userName: "",
  openFeed: false,
  userType: "",
  fromReviews: false,
  scorllPosition: 0,
};

export const feed = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeeds: (state, action) => {
      state.feeds = action.payload;
    },
    setImgNumber: (state, action) => {
      state.imgNumber = action.payload;
    },
    setStars: (state, action) => {
      state.stars = action.payload;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUserCover: (state, action) => {
      state.userCover = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setOpenFeed: (state, action) => {
      state.openFeed = action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setFromReviews: (state, action) => {
      state.fromReviews = action.payload;
    },
  },
});

export const {
  setFeeds,
  setImgNumber,
  setStars,
  setReviews,
  setUserId,
  setUserCover,
  setUserName,
  setOpenFeed,
  setUserType,
  setFromReviews,
} = feed.actions;
export default feed.reducer;
