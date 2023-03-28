import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './main';
import registerReducer from './register';
import chatReducer from './chat';
import filterReducer from './filter';
import userReducer from './user';
import marketReducer from './marketplace/marketplace';
import feedReducer from './feed';
import scrollReducer from './scroll';
import shppingCartReducer from './marketplace/shoppingCart';
import rerendersReducer from './rerenders';

export const store = configureStore({
  reducer: {
    storeMain: mainReducer,
    storeFilter: filterReducer,
    storeRegister: registerReducer,
    storeChat: chatReducer,
    storeUser: userReducer,
    storeFeed: feedReducer,
    storeMarket: marketReducer,
    storeScroll: scrollReducer,
    storeShoppingCart: shppingCartReducer,
    storeRerenders: rerendersReducer,
  },
});
