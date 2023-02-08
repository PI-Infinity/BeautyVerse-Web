import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enterSearch: false,
  openMenu: false,
  openMobileMenu: false,
  user: "",
  coverToGallery: true,
  cover: "",
  coverInfo: "",
  rerender: 1,
  loading: true,
  userList: "",
  followings: "",
  openImg: false,
  imgTargetId: "",
  currentImgNumber: 0,
  mobileFilter: false,
  loadFeed: true,
  changeFeed: true,
  navigatorActive: 0,
};

export const main = createSlice({
  name: "main",
  initialState,
  reducers: {
    setEnterSearch: (state, action) => {
      state.enterSearch = action.payload;
    },
    setOpenMenu: (state, action) => {
      state.openMenu = action.payload;
    },
    setOpenMobileMenu: (state, action) => {
      state.openMobileMenu = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCoverToGallery: (state, action) => {
      state.coverToGallery = action.payload;
    },
    setCover: (state, action) => {
      state.cover = action.payload;
    },
    setCoverInfo: (state, action) => {
      state.coverInfo = action.payload;
    },
    setRerender: (state, action) => {
      state.rerender++;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFollowings: (state, action) => {
      state.followings = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setOpenImg: (state, action) => {
      state.openImg = action.payload;
    },
    setImgTargetGallery: (state, action) => {
      state.imgTargetId = action.payload;
    },
    setCurrentImgNumber: (state, action) => {
      state.currentImgNumber = action.payload;
    },
    setFilterOpen: (state, action) => {
      state.mobileFilter = action.payload;
    },
    setLoadFeed: (state, action) => {
      state.loadFeed = action.payload;
    },
    setChangeFeed: (state, action) => {
      state.changeFeed = action.payload;
    },
    setNavigatorActive: (state, action) => {
      state.navigatorActive = action.payload;
    },
  },
});

export const {
  setEnterSearch,
  setOpenMenu,
  setOpenMobileMenu,
  setUser,
  setCoverToGallery,
  setCover,
  setRerender,
  setLoading,
  setUserList,
  setCoverInfo,
  setFollowings,
  setOpenImg,
  setImgTargetGallery,
  setCurrentImgNumber,
  setFilterOpen,
  setLoadFeed,
  setChangeFeed,
  setNavigatorActive,
} = main.actions;
export default main.reducer;
