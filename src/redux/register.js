import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: "1",
  userType: "",

  //register info
  name: "",
  map: "",
  addressInput: "",
  addationalAddress: "",
  countryCode: { value: "+995", label: "Georgia" },
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassowrd: "",

  // working info
  categories: "",
  workingDays: "",
  workingPlace: "",
};

export const register = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegisterPage: (state, action) => {
      state.page = action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setMap: (state, action) => {
      state.map = action.payload;
    },
    setAddressInput: (state, action) => {
      state.addressInput = action.payload;
    },
    setAddationalAddress: (state, action) => {
      state.addationalAddress = action.payload;
    },
    setWorkingPlace: (state, action) => {
      state.workingPlace = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setCountryCode: (state, action) => {
      state.countryCode = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setConfirmPassowrd: (state, action) => {
      state.confirmPassowrd = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setWorkingDays: (state, action) => {
      state.workingDays = action.payload;
    },
  },
});

export const {
  setRegisterPage,
  setUserType,
  setName,
  setMap,
  setAddationalAddress,
  setWorkingPlace,
  setEmail,
  setCountryCode,
  setPhoneNumber,
  setPassword,
  setConfirmPassowrd,
  setCategories,
  setAddressInput,
  setWorkingDays,
} = register.actions;
export default register.reducer;
