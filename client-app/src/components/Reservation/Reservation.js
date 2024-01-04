import ReservationDate from "./ReservationDate";
import ReservationForm from "./ReservationForm";
import ReservationRoomSelect from "./ReservationRoomSelect";
import Payment from "./Payment";
import Button from "../../UI/Button";
import LoadingIndicator from "../../UI/LoadingIndicator";

import { useEffect, useState, useCallback } from "react";
import { getToken } from "../../users/user-data";
import { useDispatch, useSelector } from "react-redux";
import { reserveActions } from "../../store/reservation";
import { useParams, useNavigate } from "react-router-dom";
import { url } from "../../utils/backendUrl";

import classes from "./Reservation.module.css";

const Reservation = function () {
  const reservationState = useSelector((state) => state.reserve);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const token = getToken();

  // Hàm gửi request tạo transaction
  const transactionRequest = useCallback(
    async function (bodyData) {
      setIsLoading(true);

      try {
        const req = await fetch(`${url}/transactions/add-transactionzz`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(bodyData),
        });

        const data = await req.json();

        if (req.status === 501 || req.status === 401 || req.status === 403) {
          setError(data);
        }
      } catch (err) {
        setError(err.message);
      }

      setIsLoading(false);
      navigate("/transactions");
    },
    [token, navigate]
  );

  // Xử lý sự kiện đặt phòng
  const reserveHandler = function () {
    // Lấy toàn bộ dữ liệu state = useSelector để check xem có trường nào trống không
    // Nếu có báo lỗi
    if (reservationState.room.length === 0) {
      setError("Bạn cần chọn phòng");
      return;
    }

    if (
      reservationState.userFullName === "" ||
      reservationState.userEmail === "" ||
      reservationState.userPhoneNum === "" ||
      reservationState.userIdentityCard === ""
    ) {
      setError("Bạn cần điền đầy đủ thông tin vào phom");
      return;
    }

    if (reservationState.payment === "none") {
      setError("Bạn hãy chọn một phương thức thanh toán");
      return;
    }

    // Gửi request tạo transaction, kèm theo token
    // Tạo object data làm request body, là các thông tin trong state
    const data = {
      user: reservationState.user,
      hotel: reservationState.hotelId,
      room: reservationState.room,
      dateStart: reservationState.dateStart,
      dateEnd: reservationState.dateEnd,
      price: reservationState.price,
      payment: reservationState.payment,
      status: "Booked",
    };

    transactionRequest(data);
  };

  // Hàm fetch thông tin người dùng
  const fetchUserInfo = useCallback(
    async function () {
      try {
        const res = await fetch(`${url}/userInfo`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();
        //Nếu lấy dữ liệu thành công thì lưu vào state
        if (res.status === 200) {
          setUserInfo(data);
        }
      } catch (err) {
        setUserInfo(undefined);
      }
    },
    [token]
  );

  // Fetch thông tin người dùng đưa vào input
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  //Reset lại reservation state khi người dùng nhấn vào 1 khách sạn khác
  useEffect(() => {
    dispatch(reserveActions.reset());
  }, []);

  // Reset lỗi khi người dùng thao tác với form
  useEffect(() => {
    setError(null);
  }, [reservationState]);

  return (
    <>
      <div className={classes.container}>
        <ReservationDate />
        <ReservationForm userInfo={userInfo} />
      </div>

      <ReservationRoomSelect hotelId={params.hotelId} />
      <div className={classes.action}>
        <Payment userInfo={userInfo} />

        <Button className={classes.btn} onClick={reserveHandler}>
          <span>{!isLoading ? "Reserve Now" : "Processing"}</span>
          {isLoading && <LoadingIndicator className={classes.loading} />}
        </Button>
        {error && <span className={classes.error}>{error}</span>}
      </div>
    </>
  );
};

export default Reservation;
