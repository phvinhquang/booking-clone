import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = { isAuthenticated: false, email: null };

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    logIn(state, action) {
      return { isAuthenticated: true, email: action.payload };
    },

    logOut(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      return { isAuthenticated: false, email: null };
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
