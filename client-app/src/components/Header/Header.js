import "./Header.css";
import Navbar from "./Navbar";
import Button from "../../UI/Button";
import SearchForm from "./SearchForm";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

import { getUsername } from "../../users/user-data";

function Header(props) {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  //Lấy giá trị token và username trong local storage, nếu có
  const username = getUsername();

  // const backToHomePage = function () {
  //   window.location.replace("/");
  // };

  const logOutHandler = function () {
    dispatch(authActions.logOut());
  };

  const logIn = function () {
    console.log("Log In clicked");
  };

  return (
    <header className={`${props.showJustTop ? "header-auth" : "header"}`}>
      <div className="header-container">
        <div className="header-top">
          {/* <span onClick={backToHomePage} className="header-title"> */}
          <Link to="/" className="header-title">
            {" "}
            Booking Website
          </Link>
          {/* </span> */}
          <div className="header-nav">
            <p>{username ? username : ""}</p>
            {!isAuth && (
              <Link to="/auth?mode=register">
                <button type="button" className="header-nav-button">
                  Register
                </button>
              </Link>
            )}
            {!isAuth && (
              <Link to="/auth?mode=login">
                <button
                  type="button"
                  className="header-nav-button"
                  onClick={logIn}
                >
                  Login
                </button>
              </Link>
            )}

            {isAuth && (
              <Link to="/transactions">
                <button className="header-nav-button">Transactions </button>
              </Link>
            )}
            {isAuth && (
              <button
                type="button"
                onClick={logOutHandler}
                className="header-nav-button"
              >
                Logout
              </button>
            )}
          </div>
        </div>
        {!props.showNav && <Navbar />}

        {!props.showJustTop && (
          <div className="header-text">
            <h2>A life time of discounts? It's Genius</h2>
            <h3>
              Get rewarded for your travels - unlock instant savings of 10% or
              more with free acount
            </h3>
          </div>
        )}
        {!props.showJustTop && !isAuth && (
          <Button>
            <Link to="/auth?mode=login">Sign in/Register</Link>
          </Button>
        )}
        {!props.showJustTop && <SearchForm className="form-absolute" />}
      </div>
    </header>
  );
}

export default Header;
