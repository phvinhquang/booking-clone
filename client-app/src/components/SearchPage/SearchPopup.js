import "./SearchPopup.css";
import Button from "../../UI/Button";

function SearchPopup() {
  return (
    <div className="card-popup">
      <div className="popup-container">
        <h1>Search</h1>
        <div className="input-destination">
          <h4>Destination</h4>
          <input type="text" />
        </div>
        <div className="input-date-popup">
          <h4>Check-in Date</h4>
          <div className="input-date-popup-text">
            <i className="fa-solid fa-calendar"></i>
            <span>27/06/2023 to 27/06/2023</span>
          </div>
        </div>

        {/* Options list */}
        <div className="input-options">
          <h4>Options</h4>
          <div className="input-flex input-options-min">
            <span>
              Min price <span className="smaller-text">per night</span>
            </span>
            <input type="number" />
          </div>
          <div className="input-flex  input-options-max">
            <span>
              Max price <span className="smaller-text">per night</span>
            </span>
            <input type="number" />
          </div>
          <div className="input-flex  input-options-adult">
            <span>Adult</span>
            <input type="number" />
          </div>
          <div className="input-flex  input-options-children">
            <span>Chidren</span>
            <input type="number" />
          </div>
          <div className="input-flex  input-options-room">
            <span>Room</span>
            <input type="number" />
          </div>
        </div>

        <Button className="btn-popup-search">Search</Button>
      </div>
    </div>
  );
}

export default SearchPopup;
