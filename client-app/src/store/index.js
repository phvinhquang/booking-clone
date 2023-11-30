import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./auth";
import searchSlice from "./search";
import reserveSlice from "./reservation";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    search: searchSlice.reducer,
    reserve: reserveSlice.reducer,
  },
});

export default store;
