import classes from "./MainNavigation.module.css";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";
import { useNavigate } from "react-router-dom";
import { emailLoader } from "../../utils/auth";

const MainNavigation = function () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = emailLoader();

  const logoutHandler = function () {
    const confirm = window.confirm("Bạn có chắc chắn muốn đăng xuất không ?");

    if (confirm) {
      dispatch(authActions.logOut());
      navigate("/login");
    }
  };

  return (
    <nav>
      <h3>MAIN</h3>
      <NavLink to="/">
        <i className="fa-solid fa-database"></i>
        <span>Dashboard</span>
      </NavLink>

      <h3>LISTS</h3>
      <NavLink to="/">
        <i className="fa-regular fa-user"></i>
        <span>Users</span>
      </NavLink>
      <NavLink to="/hotels">
        <i className="fa-solid fa-hotel"></i>
        <span>Hotels</span>
      </NavLink>
      <NavLink to="/rooms">
        <i className="fa-solid fa-door-closed"></i> <span>Rooms</span>
      </NavLink>
      <NavLink to="/transactions">
        <i className="fa-solid fa-truck"></i>
        <span>Transactions</span>
      </NavLink>

      <h3>NEW</h3>
      <NavLink to="/new-hotel">
        <i className="fa-solid fa-hotel"></i>
        <span>New Hotel</span>
      </NavLink>
      <NavLink to="/new-room">
        <i className="fa-solid fa-door-closed"></i>
        <span>New Room</span>
      </NavLink>

      <h3>USER</h3>
      {email && (
        <div className={classes.user}>
          {/* <i className="fa-regular fa-user"></i> */}
          <span>{email}</span>
        </div>
      )}
      <button
        type="button"
        className={classes["btn-logout"]}
        onClick={logoutHandler}
      >
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
        <span>Log Out</span>
      </button>
    </nav>
  );
};

export default MainNavigation;
