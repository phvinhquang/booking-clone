import classes from "./ReservationForm.module.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { reserveActions } from "../../store/reservation";

const ReservationForm = function ({ userInfo }) {
  const dispatch = useDispatch();
  // Set các thông tin trong form lên state redux
  useEffect(() => {
    dispatch(reserveActions.setUserFullName(userInfo.fullName));
    dispatch(reserveActions.setUserEmail(userInfo.email));
    dispatch(reserveActions.setUserPhoneNum(userInfo.phoneNumber));
    dispatch(reserveActions.setUsername(userInfo.username));
  }, [userInfo]);

  const fullNameChangeHandler = function (e) {
    dispatch(reserveActions.setUserFullName(e.target.value));
  };
  const fullNameBlurHandler = function (e) {
    dispatch(reserveActions.setUserFullName(e.target.value));
  };

  const emailChangeHandler = function (e) {
    dispatch(reserveActions.setUserEmail(e.target.value));
  };
  const emailBlurHandler = function (e) {
    dispatch(reserveActions.setUserEmail(e.target.value));
  };

  const phoneNumChangeHandler = function (e) {
    dispatch(reserveActions.setUserPhoneNum(e.target.value));
  };
  const phoneNumBlurHandler = function (e) {
    dispatch(reserveActions.setUserPhoneNum(e.target.value));
  };

  const identityCardChangeHandler = function (e) {
    dispatch(reserveActions.setUserIdentityCard(e.target.value));
  };
  const identityCardBlurHandler = function (e) {
    dispatch(reserveActions.setUserIdentityCard(e.target.value));
  };
  return (
    <div className={classes["reserve-info"]}>
      <h1>Reserve Info</h1>

      <form className={classes.form}>
        <label htmlFor="name">Your Full Name:</label>
        <input
          type="text"
          placeholder="Full Name"
          defaultValue={userInfo && userInfo.fullName}
          onChange={fullNameChangeHandler}
          onBlur={fullNameBlurHandler}
        />

        <label htmlFor="email">Your Email:</label>
        <input
          type="email"
          placeholder="Email"
          defaultValue={userInfo && userInfo.email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />

        <label htmlFor="phone">Your Phone Number:</label>
        <input
          type="tel"
          placeholder="Phone Number"
          defaultValue={userInfo && userInfo.phoneNumber}
          onChange={phoneNumChangeHandler}
          onBlur={phoneNumBlurHandler}
        />

        <label htmlFor="identity-card">Your Identity Card Number:</label>
        <input
          type="text"
          placeholder="Card Number"
          onChange={identityCardChangeHandler}
          onBlur={identityCardBlurHandler}
        />
      </form>
    </div>
  );
};

export default ReservationForm;
