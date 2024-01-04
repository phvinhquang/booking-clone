import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reserveActions } from "../../store/reservation";
import { url } from "../../utils/backendUrl";
// import { format } from "date-fns";

import classes from "./ReservationRoomSelect.module.css";

const ReservationRoomSelect = function ({ hotelId }) {
  const dispatch = useDispatch();

  const startDate = useSelector((state) => state.search.dateStart);
  const endDate = useSelector((state) => state.search.dateEnd);

  const [availableRooms, setAvailableRooms] = useState([]);
  // const [checkedRooms, setCheckedRooms] = useState([]);

  // Hàm lấy thông tin những phòng còn trống của khách sạn theo ngày
  const availableRoomRequest = useCallback(
    async function () {
      try {
        const req = await fetch(`${url}/rooms/${hotelId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateStart: startDate,
            dateEnd: endDate,
          }),
        });


        const data = await req.json();
        const rooms = data.rooms;
        setAvailableRooms(rooms);
      } catch (err) {}
    },
    [hotelId, startDate, endDate]
  );

  useEffect(() => {
    availableRoomRequest();
  }, [availableRoomRequest]);

  //Hàm xử lý khi người dùng chọn phòng
  const checkedHandler = function (e, roomNum, room) {
    // console.log("checked", e.target.checked, roomNum);
    // console.log("room", room);

    const isChecked = e.target.checked;
    // State cấu trúc như transaction
    // Rooms có id room và số phòng

    //Kiểm tra trạng thái check, nếu true thì đưa vào array
    if (isChecked) {
      dispatch(
        reserveActions.addCheckedRoom({
          hotelId: hotelId,
          roomId: room._id,
          title: room.title,
          price: room.price,
          checkedRoom: roomNum,
          dateStart: startDate.split("/").join("-"),
          dateEnd: endDate.split("/").join("-"),
        })
      );
    }

    //Nếu checked = false thì filter khỏi array
    if (!isChecked) {
      dispatch(
        reserveActions.removeCheckedRoom({
          hotelId: hotelId,
          roomId: room._id,
          title: room.title,
          price: room.price,
          checkedRoom: roomNum,
          dateStart: startDate.split("/").join("-"),
          dateEnd: endDate.split("/").join("-"),
        })
      );
    }
  };

  return (
    <div>
      <h1>Select Rooms</h1>
      <div className={classes.container}>
        {availableRooms.length > 0 &&
          availableRooms.map((room) => (
            <div key={room._id} className={classes["room-flexbox"]}>
              <div className={classes["room-info"]}>
                <h3>{room.title}</h3>
                <p>{room.desc}</p>
                <h4>
                  Max People: <span>{room.maxPeople}</span>
                </h4>
                <h5>$ {room.price}</h5>
              </div>

              <div className={classes["room-available"]}>
                <form className={classes.form}>
                  {room.roomNumbers.length > 0 &&
                    room.roomNumbers.map((number, i) => (
                      <div key={i} className={classes.checkbox}>
                        <label htmlFor={room.roomNumbers[i]}>
                          {room.roomNumbers[i]}
                        </label>
                        <input
                          type="checkbox"
                          id={room.roomNumbers[i]}
                          onChange={(e) => {
                            checkedHandler(e, room.roomNumbers[i], room);
                          }}
                        />
                      </div>
                    ))}
                </form>
              </div>
            </div>
          ))}
        {availableRooms.length === 0 && (
          <p className={classes["no-room"]}>
            Ngày bạn đang chọn khách sạn này không còn phòng trống, vui lòng thử
            một ngày khác.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReservationRoomSelect;
