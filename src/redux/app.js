import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // backendUrl: 'http://192.168.0.106:5000',
  backendUrl: 'https://beautyverse.herokuapp.com',
  language: 'en',
  scrollToTop: false,
  backPath: null,
  machineId: null,
};

export const App = createSlice({
  name: 'App',
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setScrollToTop: (state, action) => {
      state.scrollToTop = !state.scrollToTop;
    },
    setBackPath: (state, action) => {
      state.backPath = action.payload;
    },
    setMachineId: (state, action) => {
      state.machineId = action.payload;
    },
  },
});

export const {
  setLoading,
  setLanguage,
  setScrollToTop,
  setBackPath,
  setMachineId,
} = App.actions;
export default App.reducer;
