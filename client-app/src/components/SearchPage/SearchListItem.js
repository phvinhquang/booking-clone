import styles from "./SearchListItem.module.css";
import Button from "../../UI/Button";
import { Link } from "react-router-dom";

function SearchListItem(props) {
  const freeCancelText = (
    <div className={styles["cancel-text"]}>
      <h3>Free Cancelation</h3>
      <h3>You can cancel later, so lock in this great price today</h3>
    </div>
  );

  return (
    <Link className={styles["search-list-item"]} to={`/detail/${props.id}`}>
      <div>
        <img className={styles["search-list-item-img"]} src={props.img} />
      </div>
      <div className={styles["search-list-item-info"]}>
        <div className={styles["search-list-item-info-col-1"]}>
          <h1 className={styles["hotel-name"]}>{props.name}</h1>
          <h2 className={styles["hotel-distance"]}>
            {props.distance}m from center
          </h2>
          {/* <h3 className={styles["hotel-tag"]}>{props.tag}</h3> */}
          <h3 className={styles["hotel-address"]}>Address: {props.address}</h3>
          {/* <h3 className={styles["hotel-type"]}>{props.type}</h3> */}
          {freeCancelText}
        </div>
        <div className={styles["search-list-item-info-col-2"]}>
          <div className={styles["hotel-rate"]}>
            <div className={styles["hotel-rate-text"]}>Rating</div>
            <div className={styles["hotel-rate-point"]}>
              {props.rate.toFixed(1)}
            </div>
          </div>
          <div className={styles["hotel-price"]}>
            <div className={styles["hotel-price-num"]}>From ${props.price}</div>
            <h3>Includes taxes and fees</h3>
            <Button className={styles["btn-availability"]}>See Detail</Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SearchListItem;
