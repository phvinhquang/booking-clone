import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../users/user-data";
import { authActions } from "../store/auth";

const Root = function () {
  const email = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();
  const token = getToken();

  useEffect(() => {
    if (token) {
      dispatch(authActions.logIn(email));
    }
  }, [token, email, dispatch]);

  return <Outlet />;
};

export default Root;
