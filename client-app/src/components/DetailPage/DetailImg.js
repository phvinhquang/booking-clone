import styles from "./DetailImg.module.css";

function DetailImg({ hotel }) {
  return (
    <div className={styles["img-container"]}>
      {hotel.photos &&
        hotel.photos.map((img, i) => (
          <div key={i}>
            <img className={styles["img"]} src={img} alt="" />
          </div>
        ))}
    </div>
  );
}

export default DetailImg;
