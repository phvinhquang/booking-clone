import { createSlice } from "@reduxjs/toolkit";

const initialLoadingState = { isLoading: false };

const loadingSlice = createSlice({
  name: "loading",
  initialState: initialLoadingState,
  reducers: {
    setLoadingTrue(state) {
      state.isLoading = true;
    },
    setLoadingFalse(state) {
      state.isLoading = false;
    },
  },
});

export default loadingSlice;
