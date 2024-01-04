import classes from "./Payment.module.css";
import { useSelector, useDispatch } from "react-redux";
import { reserveActions } from "../../store/reservation";

const Payment = function ({ userInfo }) {
  const dispatch = useDispatch();
  const totalBill = useSelector((state) => state.reserve.price);


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
      </div>
    </div>
  );
};

export default Payment;
