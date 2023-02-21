import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  filter: "",
  cityFilter: "City",
  destrictFilter: "District",
  specialist: true,
  object: true,
  shop: true,
  reiting: false,
};

export const filter = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setCityFilter: (state, action) => {
      state.cityFilter = action.payload;
    },
    setDestrictFilter: (state, action) => {
      state.destrictFilter = action.payload;
    },
    setSpecialist: (state, action) => {
      state.specialist = action.payload;
    },
    setObject: (state, action) => {
      state.object = action.payload;
    },
    setShop: (state, action) => {
      state.shop = action.payload;
    },
    setReiting: (state, action) => {
      state.reiting = action.payload;
    },
  },
});

export const {
  setSearch,
  setFilter,
  setCityFilter,
  setDestrictFilter,
  setSpecialist,
  setObject,
  setShop,
  setReiting,
} = filter.actions;
export default filter.reducer;
