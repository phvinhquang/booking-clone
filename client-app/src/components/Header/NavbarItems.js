import "./NavbarItems.css";

function NavbarItems(props) {
  return (
    <li className={`navbar-item ${props.active ? "active" : ""}`}>
      {props.children}
    </li>
  );
}

export default NavbarItems;
