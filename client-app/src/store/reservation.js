import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

const initialReserveState = {
  user: "",
  userFullName: "",
  userEmail: "",
  userPhoneNum: "",
  userIdentityCard: "",
  hotelId: "",
  dateStart: "",
  dateEnd: "",
  room: [],
  price: 0,
  payment: "none",
};

const reserveSlice = createSlice({
  name: "reservation",
  initialState: initialReserveState,
  reducers: {
    addCheckedRoom(state, action) {
      // console.log(action.payload);
      let updatedRooms = [...state.room];
      let updatedPrice;
      //Tính số ngày được đặt
      const oneDay = 24 * 60 * 60 * 1000;
      const dateStart = new Date(action.payload.dateStart);
      let dateEnd = new Date(action.payload.dateEnd);
      let numberOfDays = (dateEnd - dateStart) / oneDay;
      //Trường hợp khách chọn ngày đến và đi là cùng 1 ngày thì vẫn tính đặt 1 ngày
      if (numberOfDays === 0) {
        const newDateEnd = new Date(dateEnd);
        newDateEnd.setDate(dateEnd.getDate() + 1);
        dateEnd = newDateEnd;

        numberOfDays = 1;
      }
      //Kiểm tra xem roomId đã tồn tại chưa
      const existingRoomIndex = state.room.findIndex(
        (r) => r.roomType === action.payload.roomId
      );

      const existingRoom = state.room[existingRoomIndex];

      // Nếu tồn tại rồi thì thêm số phòng vào room
      if (existingRoom) {
        // Cập nhật lại roomNumbers cho phòng đó
        const newRoomNumbers = existingRoom.roomNumbers.concat(
          action.payload.checkedRoom
        );
        const updatedRoom = { ...existingRoom, roomNumbers: newRoomNumbers };

        // Cập nhật danh sách phòng được đặt
        updatedRooms[existingRoomIndex] = updatedRoom;
      }

      // Nếu chưa thì thêm room mới
      if (!existingRoom) {
        updatedRooms.push({
          roomType: action.payload.roomId,
          price: action.payload.price,
          roomNumbers: [action.payload.checkedRoom],
        });
      }

      //Cập nhật bill
      updatedPrice = state.price + action.payload.price * numberOfDays;
      // Cập nhật state mới
      const newState = {
        ...state,
        hotelId: action.payload.hotelId,
        dateStart: format(dateStart, "yyyy-MM-dd"),
        dateEnd: format(dateEnd, "yyyy-MM-dd"),
        room: updatedRooms,
        price: updatedPrice,
      };

      console.log(newState);
      return newState;
    },

    removeCheckedRoom(state, action) {
      let updatedRooms = [...state.room];
      let updatedPrice;

      //Tính số ngày được đặt
      const oneDay = 24 * 60 * 60 * 1000;
      const dateStart = new Date(action.payload.dateStart);
      let dateEnd = new Date(action.payload.dateEnd);
      let numberOfDays = (dateEnd - dateStart) / oneDay;
      //Trường hợp khách chọn ngày đến và đi là cùng 1 ngày thì vẫn tính đặt 1 ngày
      if (numberOfDays === 0) {
        const newDateEnd = new Date(dateEnd);
        newDateEnd.setDate(dateEnd.getDate() + 1);
        dateEnd = newDateEnd;

        numberOfDays = 1;
      }

      //Tìm Room bị unchecked
      const existingRoomIndex = state.room.findIndex(
        (r) => r.roomType === action.payload.roomId
      );
      const existingRoom = state.room[existingRoomIndex];

      //Cập nhật lại roomNumbers của phòng
      //Nếu số room lớn hơn 1 thì filter out room bị unchecked
      if (existingRoom.roomNumbers.length > 1) {
        const newRoomNumbers = existingRoom.roomNumbers.filter(
          (num) => num !== action.payload.checkedRoom
        );
        const updatedRoom = { ...existingRoom, roomNumbers: newRoomNumbers };

        // Cập nhật danh sách phòng được đặt
        updatedRooms[existingRoomIndex] = updatedRoom;
      } else {
        //Nếu số room = 1 thì xóa room đó khỏi array rooms
        updatedRooms.splice(existingRoomIndex, 1);
      }

      //Cập nhật bill
      updatedPrice = state.price - action.payload.price * numberOfDays;
      // Cập nhật state mới
      const newState = {
        ...state,
        hotelId: action.payload.hotelId,
        dateStart: format(dateStart, "yyyy-MM-dd"),
        dateEnd: format(dateEnd, "yyyy-MM-dd"),
        room: updatedRooms,
        price: updatedPrice,
      };

      console.log("unchecked", newState);
      return newState;
    },

    changeDates(state, action) {
      // const updatedDateStart = action.payload.dateStart;
      // const updatedDateEnd = action.payload.dateEnd;

      //Tính số ngày được đặt
      const oneDay = 24 * 60 * 60 * 1000;
      const dateStart = new Date(action.payload.dateStart);
      let dateEnd = new Date(action.payload.dateEnd);
      let numberOfDays = (dateEnd - dateStart) / oneDay;
      //Trường hợp khách chọn ngày đến và đi là cùng 1 ngày thì vẫn tính đặt 1 ngày
      if (numberOfDays === 0) {
        const newDateEnd = new Date(dateEnd);
        newDateEnd.setDate(dateEnd.getDate() + 1);
        dateEnd = newDateEnd;

        numberOfDays = 1;
      }

      //Nếu array room = 0 thì return state cũ, nếu không thì tính total bill mới
      if (state.room.length > 0) {
        const updatedPrice = state.room.reduce(
          (acc, cur) => acc + cur.roomNumbers.length * cur.price * numberOfDays,
          0
        );

        return {
          ...state,
          dateStart: format(dateStart, "yyyy-MM-dd"),
          dateEnd: format(dateEnd, "yyyy-MM-dd"),
          price: updatedPrice,
        };
      } else {
        return state;
      }
    },

    setPaymentMethod(state, action) {
      state.payment = action.payload;
    },

    setUsername(state, action) {
      state.user = action.payload;
    },

    setUserFullName(state, action) {
      state.userFullName = action.payload;
    },

    setUserEmail(state, action) {
      state.userEmail = action.payload;
    },

    setUserPhoneNum(state, action) {
      state.userPhoneNum = action.payload;
    },

    setUserIdentityCard(state, action) {
      state.userIdentityCard = action.payload;
    },

    reset(state) {
      state.dateStart = "";
      state.dateEnd = "";
      state.room = [];
      state.price = 0;
      state.payment = "none";
    },
  },
});

export const reserveActions = reserveSlice.actions;

export default reserveSlice;
