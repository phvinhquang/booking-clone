import "./Header.css";
import Navbar from "./Navbar";
import Button from "../../UI/Button";
import SearchForm from "./SearchForm";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

import { getEmail } from "../../users/user-data";

function Header(props) {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //Lấy giá trị token và username trong local storage, nếu có
  const email = getEmail();

  // const backToHomePage = function () {
  //   window.location.replace("/");
  // };

  const logOutHandler = function () {
    const confirm = window.confirm("Bạn có chắc chắn muốn đăng xuất không ?");
    if (confirm) {
      dispatch(authActions.logOut());
      navigate("/auth?mode=login");
    }
  };

  return (
    <header className={`${props.showJustTop ? "header-auth" : "header"}`}>
      <div className="header-container">
        <div className="header-top">
          {/* <span onClick={backToHomePage} className="header-title"> */}
          <Link to="/" className="header-title">
            Booking Website
          </Link>
          {/* </span> */}
          <div className="header-nav">
            <p>{email ? email : ""}</p>
            {!isAuth && (
              <Link to="/auth?mode=register">
                <button type="button" className="header-nav-button">
                  Register
                </button>
              </Link>
            )}
            {!isAuth && (
              <Link to="/auth?mode=login">
                <button type="button" className="header-nav-button">
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
