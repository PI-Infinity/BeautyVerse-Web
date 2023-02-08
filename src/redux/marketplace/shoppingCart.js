import { createSlice } from "@reduxjs/toolkit";
import react, { useEffect } from "react";

const initialState = {
  cart: [],
};

export const shoppingCart = createSlice({
  name: "shoppingCart",
  initialState,

  reducers: {
    setCart: (state, action) => {
      state.cart.push(action.payload);
    },
    setCartList: (state, action) => {
      state.cart = action.payload;
    },
    removeItem: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload);
      const index = state.cart.indexOf(item);
      if (index > -1) {
        // only splice array when item is found
        state.cart.splice(index, 1); // 2nd parameter means remove one item only
      }
    },
    Decriment: (state, action) => {
      const item = state.cart.find((prdct) => prdct.id === action.payload);
      if (item.quantity > 1) {
        state = state.cart?.map((items) =>
          items.id === action.payload
            ? {
                ...items,
                quantity: (items.quantity -= 1),
              }
            : items
        );
      } else {
        state = state.cart?.map((items) =>
          items.id === action.payload
            ? {
                ...items,
              }
            : items
        );
      }
    },
    Increment: (state, action) => {
      const item = state.cart.find((prdct) => prdct.id === action.payload);
      if (item) {
        state = state.cart?.map((items) =>
          items.id === action.payload
            ? {
                ...items,
                quantity: (items.quantity += 1),
              }
            : items
        );
      } else {
        return false;
      }
    },
    ClearCart: (state, action) => {
      state.cart = [];
    },
  },
});

export const {
  setCart,
  setCartList,
  removeItem,
  Increment,
  Decriment,
  ClearCart,
} = shoppingCart.actions;
export default shoppingCart.reducer;
