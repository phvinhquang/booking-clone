import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

const initDateStart = new Date();
const initDateEnd = new Date(initDateStart);
initDateEnd.setDate(initDateStart.getDate() + 1);

const initialSearchState = {
  city: "",
  dateStart: format(initDateStart, "yyyy/MM/dd"),
  dateEnd: format(initDateEnd, "yyyy/MM/dd"),
  adult: 1,
  children: 0,
  room: 1,
  result: [],
  isSearching: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    setCityValue(state, action) {
      state.city = action.payload;
    },

    setOptionsValues(state, action) {
      state[action.payload.name] =
        action.payload.option === "increase"
          ? state[action.payload.name] + 1
          : state[action.payload.name] - 1;
    },

    setDateValues(state, action) {
      state.dateStart = action.payload.dateStart;
      state.dateEnd = action.payload.dateEnd;
    },

    setResult(state, action) {
      state.result = action.payload;
    },

    setSearching(state) {
      state.isSearching = true;
    },

    setNotSearching(state) {
      state.isSearching = false;
    },
  },
});

export const searchActions = searchSlice.actions;

export default searchSlice;
