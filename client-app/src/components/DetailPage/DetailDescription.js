import styles from "./DetailDescription.module.css";

import Button from "../../UI/Button";
import Reservation from "../Reservation/Reservation";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DetailDescription({ hotel }) {
  const [showReservation, setShowReservation] = useState(false);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const reserveHandler = function () {
    setShowReservation((prevState) => !prevState);
  };

  return (
    <>
      <div className={styles["description-container"]}>
        <div className={styles["description-text"]}>
          <h1>{hotel.title}</h1>
          <p>{hotel.desc}</p>
        </div>
        <div className={styles["description-price"]}>
          <div className={styles.card}>
            <h2 className={styles.price}>
              ${hotel.cheapestPrice} <span>(1 night)</span>
            </h2>
            <Button className={styles["btn-reserve"]} onClick={reserveHandler}>
              Reserve or Book Now!
            </Button>
          </div>
        </div>
      </div>

      {showReservation && isAuth && <Reservation />}
      {showReservation && !isAuth && (
        <div>
          <p className={styles.error}>Bạn cần đăng nhập để đặt phòng</p>
          <p className={styles["error-action"]}>
            <Link to="/auth?mode=login">Click vào đây</Link> để đăng nhập
          </p>
        </div>
      )}
    </>
  );
}

export default DetailDescription;
