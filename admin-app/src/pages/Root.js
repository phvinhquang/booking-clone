import classes from "./Root.module.css";

import { Outlet, Link } from "react-router-dom";
import MainNavigation from "../components/Navigation/MainNavigation";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { tokenLoader, emailLoader } from "../utils/auth";

const RootLayout = function () {
  const token = tokenLoader();
  const email = emailLoader();
  const dispath = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      dispath(authActions.logIn({ token: token, email: email }));
    }

    if (!token) {
      navigate("/login");
    }
  }, [token, email]);

  return (
    <main className={classes.main}>
      <h1 className={classes.title}>
        <Link to="/">Admin Page</Link>
      </h1>
      <div className={classes.vertical}></div>
      {/* <div></div> */}
      <div className={classes.line}></div>
      <MainNavigation />
      <div className={classes.vertical}></div>

      <div className={classes.outlet}>
        <Outlet />
      </div>
    </main>
  );
};

export default RootLayout;
