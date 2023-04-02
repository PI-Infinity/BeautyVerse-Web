import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  enterSearch: false,
  openMenu: false,
  openMobileMenu: false,
  targetUser: [],
  coverToGallery: true,
  coverUrl: undefined,
  rerender: 1,
  loading: true,
  userList: [],
  followings: [],
  openImg: false,
  imgTargetId: '',
  currentImgNumber: 0,
  mobileFilter: false,
  loadFeed: true,
  loadFeeds: true,
  changeFeed: true,
  navigatorActive: 0,
  backdrop: false,
  theme: true,
  language: '',
  country: '',
};

export const main = createSlice({
  name: 'main',
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

    // target user
    setTargetUser: (state, action) => {
      state.targetUser = action.payload;
    },

    //
    setCoverToGallery: (state, action) => {
      state.coverToGallery = action.payload;
    },
    setCoverUrl: (state, action) => {
      state.coverUrl = action.payload;
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
      const newFeeds = action.payload;

      // Create a map from the new feeds list
      const newFeedsMap = new Map(newFeeds.map((feed) => [feed._id, feed]));

      // Remove duplicates from the current state
      state.userList = state.userList.filter(
        (feed) => !newFeedsMap.has(feed._id)
      );

      // Merge the current state with the new feeds
      state.userList = [...state.userList, ...newFeeds];
    },
    setUserListClear: (state, action) => {
      state.userList = [];
    },
    UpdateUserList: (state, action) => {
      state.userList.pop();
      state.userList.unshift(action.payload);
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
    setLoadFeeds: (state, action) => {
      state.loadFeeds = action.payload;
    },
    setChangeFeed: (state, action) => {
      state.changeFeed = action.payload;
    },
    setNavigatorActive: (state, action) => {
      state.navigatorActive = action.payload;
    },
    setBackdropOpen: (state, action) => {
      state.backdrop = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
  },
});

export const {
  setEnterSearch,
  setOpenMenu,
  setOpenMobileMenu,
  setUser,
  setTargetUser,
  UpdateProcedurePrice,
  setCoverToGallery,
  setCoverUrl,
  setRerender,
  setLoading,
  setUserList,
  setUserListClear,
  UpdateUserList,
  setCoverInfo,
  setFollowings,
  setOpenImg,
  setImgTargetGallery,
  setCurrentImgNumber,
  setFilterOpen,
  setLoadFeed,
  setLoadFeeds,
  setChangeFeed,
  setNavigatorActive,
  setBackdropOpen,
  setTheme,
  setLanguage,
  setCountry,
} = main.actions;
export default main.reducer;
