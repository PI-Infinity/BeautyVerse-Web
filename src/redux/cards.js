import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  page: 1,
  cards: [],
  search: "",
  categoryFilter: "",
  type: "",
  city: "",
  district: "",
  specialist: true,
  beautyCenter: true,
  shop: true,
  scrollY: 0,
  rerenderCards: false,
};

export const Cards = createSlice({
  name: "Cards",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setCards: (state, action) => {
      state.cards = action.payload;
    },
    AddCards: (state, action) => {
      const newFeeds = action.payload;
      state.cards = newFeeds.reduce(
        (acc, curr) => {
          const existingFeedIndex = acc.findIndex(
            (card) => card._id === curr._id
          );

          if (existingFeedIndex !== -1) {
            // card already exists, merge the data
            acc[existingFeedIndex] = { ...acc[existingFeedIndex], ...curr };
          } else {
            // card doesn't exist, add to the array
            acc.push(curr);
          }

          return acc;
        },
        [...state.cards]
      );
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setDistrict: (state, action) => {
      state.district = action.payload;
    },
    setSpecialist: (state, action) => {
      state.specialist = action.payload;
    },
    setBeautyCenter: (state, action) => {
      state.beautyCenter = action.payload;
    },
    setShop: (state, action) => {
      state.shop = action.payload;
    },
    setScrollYCards: (state, action) => {
      state.scrollY = action.payload;
    },
    setRerenderCards: (state, action) => {
      state.rerenderCards = !state.rerenderCards;
    },
  },
});

export const {
  setLoading,
  setPage,
  setCards,
  AddCards,
  setSearch,
  setCategoryFilter,
  setCity,
  setDistrict,
  setSpecialist,
  setBeautyCenter,
  setShop,
  setScrollYCards,
  setRerenderCards,
} = Cards.actions;
export default Cards.reducer;
