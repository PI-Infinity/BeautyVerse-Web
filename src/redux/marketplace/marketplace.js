import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentShopProducts: [],
  shopList: [],
  filter: false,
};

export const market = createSlice({
  name: "market",
  initialState,
  reducers: {
    setCurrentShopProducts: (state, action) => {
      state.currentShopProducts = action.payload;
    },
    setShopList: (state, action) => {
      state.shopList = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { setCurrentShopProducts, setShopList, setFilter } =
  market.actions;
export default market.reducer;
