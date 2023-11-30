import "./Navbar.css";
import NavbarItems from "./NavbarItems";
import navData from "../../data/navBar.json";

function Navbar() {
  return (
    <div className="navbar">
      <ul className="navbar-list">
        {navData.map((item, i) => (
          <NavbarItems key={i} active={item.active}>
            <i className={`fa-solid ${item.icon} `}></i>
            <span>{item.type} </span>
          </NavbarItems>
        ))}
      </ul>
    </div>
  );
}

export default Navbar;
