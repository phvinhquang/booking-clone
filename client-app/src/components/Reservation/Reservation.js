import ReservationDate from "./ReservationDate";
import ReservationForm from "./ReservationForm";
import ReservationRoomSelect from "./ReservationRoomSelect";
import Payment from "./Payment";

import { useEffect, useState } from "react";
import { getToken } from "../../users/user-data";
import { useDispatch } from "react-redux";
import { reserveActions } from "../../store/reservation";
import { useParams } from "react-router-dom";

import classes from "./Reservation.module.css";

const Reservation = function () {
  const dispatch = useDispatch();
  const params = useParams();

  //Reset lại reservation state khi người dùng nhấn vào 1 khách sạn khác
  useEffect(() => {
    dispatch(reserveActions.reset());
  }, []);

  const token = getToken();

  const [userInfo, setUserInfo] = useState({});

  const fetchUserInfo = async function () {
    try {
      const res = await fetch(
        `https://booking-clone-server-xe8f.onrender.com/userInfo`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();
      //Nếu lấy dữ liệu thành công thì lưu vào state
      if (res.status === 200) {
        setUserInfo(data);
      }
    } catch (err) {
      setUserInfo(undefined);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [token]);

  return (
    <>
      <div className={classes.container}>
        <ReservationDate />
        <ReservationForm userInfo={userInfo} />
      </div>

      <ReservationRoomSelect hotelId={params.hotelId} />
      <Payment userInfo={userInfo} />
    </>
  );
};

export default Reservation;
