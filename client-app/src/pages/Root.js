import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../users/user-data";
import { authActions } from "../store/auth";
import ScrollToTop from "../UI/ScrollToTop";
import { getTokenDuration } from "../users/user-data";

const Root = function () {
  const email = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === "EXPIRED") {
      dispatch(authActions.logOut());
      return;
    }

    if (token) {
      dispatch(authActions.logIn(email));
    }

    // Auto logout khi token hết hạn
    const tokenDuration = getTokenDuration();

    const timer = setTimeout(() => {
      dispatch(authActions.logOut());
    }, tokenDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [token, email, dispatch]);

  return (
    <>
      <Outlet />;
      <ScrollToTop />
    </>
  );
};

export default Root;
