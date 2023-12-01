import { useState } from "react";
import Button from "../../UI/Button";
import classes from "./Payment.module.css";
import { useSelector, useDispatch } from "react-redux";
import { reserveActions } from "../../store/reservation";
import { useEffect } from "react";
import { getToken } from "../../users/user-data";
import { useNavigate } from "react-router-dom";

const Payment = function ({ userInfo }) {
  const dispatch = useDispatch();
  const reservationState = useSelector((state) => state.reserve);
  const totalBill = useSelector((state) => state.reserve.price);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
  }, [reservationState]);

  const transactionRequest = async function (bodyData) {
    setIsLoading(true);

    try {
      const req = await fetch(
        `http://localhost:5000/transactions/add-transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(bodyData),
        }
      );

      const data = await req.json();

      if (req.status === 501 || req.status === 401 || req.status === 403) {
        setError(data);
      }
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
    navigate("/transactions");
  };

  // Xử lý sự kiện chọn payment method
  const selectChangeHandler = function (e) {
    if (e.target.value === "credit-card") {
      dispatch(reserveActions.setPaymentMethod("Credit Cart"));
    } else if (e.target.value === "cash") {
      dispatch(reserveActions.setPaymentMethod("Cash"));
    } else {
      dispatch(reserveActions.setPaymentMethod("none"));
    }
  };

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

  return (
    <div>
      <h1>Total Bill: $ {totalBill.toLocaleString("de-DE")}</h1>
      <div className={classes["payment-method"]}>
        <select
          name="payment-method"
          id="payment-method"
          onChange={selectChangeHandler}
        >
          <option value="none">Select Payment Method</option>
          <option value="credit-card">Credit Card</option>
          <option value="cash">Cash</option>
        </select>

        <Button className={classes.btn} onClick={reserveHandler}>
          Reserve Now
        </Button>
        {isLoading && (
          <span className={classes.loading}>
            Đang xử lý đơn hàng của bạn...
          </span>
        )}
        {error && <span className={classes.error}>{error}</span>}
      </div>
    </div>
  );
};

export default Payment;
