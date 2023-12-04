import classes from "./GerneralInfo.module.css";
import { useEffect, useState } from "react";
import { tokenLoader } from "../../utils/auth";

import Card from "../../UI/Card";

const GerneralInfo = function () {
  const [generalInfo, setGeneralInfo] = useState(null);
  const token = tokenLoader();

  //Hàm fetch thông tin chung
  const fetchGeneralInfo = async function () {
    try {
      const res = await fetch(
        `https://booking-clone-server-xe8f.onrender.com/admin/overall`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();
      setGeneralInfo(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchGeneralInfo();
  }, []);

  return (
    <div className={classes["overall-container"]}>
      <Card>
        <div className={classes["overall-item"]}>
          <p>USERS</p>
          <h3>{generalInfo ? generalInfo.users : "Loading"}</h3>
          <div className={classes.icon}>
            <span className={classes["users-icon"]}>
              <i className="fa-regular fa-user"></i>
            </span>
          </div>
        </div>
      </Card>
      <Card>
        <div className={classes["overall-item"]}>
          <p>ORDERS</p>
          <h3>{generalInfo ? generalInfo.transactions : "Loading"}</h3>
          <div className={classes.icon}>
            <span className={classes["orders-icon"]}>
              <i className="fa-solid fa-cart-shopping"></i>
            </span>
          </div>
        </div>
      </Card>
      <Card>
        <div className={classes["overall-item"]}>
          <p>EARNINGS</p>
          <h3>
            $
            {generalInfo
              ? generalInfo.totalSales.toLocaleString("de-DE")
              : "Loading"}
          </h3>
          <div className={classes.icon}>
            <span className={classes["earnings-icon"]}>
              <i className="fa-solid fa-dollar-sign"></i>
            </span>
          </div>
        </div>
      </Card>
      <Card>
        <div className={classes["overall-item"]}>
          <p>BALANCE</p>
          <h3>
            $
            {generalInfo
              ? generalInfo.totalSales.toLocaleString("de-DE")
              : "Loading"}
          </h3>
          <div className={classes.icon}>
            <span className={classes["balance-icon"]}>
              <i className="fa-solid fa-wallet"></i>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GerneralInfo;
