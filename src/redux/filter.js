import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  filter: '',
  cityFilter: '',
  districtFilter: '',
  specialist: true,
  object: true,
  shop: true,
  reiting: false,
};

export const filter = createSlice({
  name: 'filter',
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
    setDistrictFilter: (state, action) => {
      state.districtFilter = action.payload;
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
  setDistrictFilter,
  setSpecialist,
  setObject,
  setShop,
  setReiting,
} = filter.actions;
export default filter.reducer;
