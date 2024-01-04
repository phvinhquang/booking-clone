import styles from "./DetailHeader.module.css";

function DetailHeader({ hotel }) {
  return (
    <div className={styles["header-container"]}>
      <h1>{hotel.name}</h1>
      <div className={styles["hotel-address"]}>
        <i className="fa-solid fa-location-dot"></i>
        <span>{hotel.address}</span>
      </div>
      <h3 className={styles["hotel-distance"]}>
        Excellent distance - {hotel.distance}m from center
      </h3>
      <h3 className={styles["hotel-price"]}>
        Book a stay over ${hotel.cheapestPrice} at this property and get a free
        airport taxi
      </h3>
    </div>
  );
}

export default DetailHeader;
