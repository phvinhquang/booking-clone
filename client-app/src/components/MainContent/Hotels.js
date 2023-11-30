import "./Hotels.css";
import { Link } from "react-router-dom";

function Hotels({ hotels }) {
  return (
    <div className="hotels-container">
      <h1>Homes guests love</h1>
      <div className="hotels-flex">
        {hotels.map((hotel, i) => (
          <div key={i} className="hotel">
            <img className="hotel-img" src={hotel.photos[0]} />
            <div className="hotel-text">
              <h3>
                <Link to={`/detail/${hotel._id}`}>{hotel.name}</Link>
              </h3>
              <h4 className="hotel-city">{hotel.city}</h4>
              <h5 className="hotel-price">
                Starting from ${hotel.cheapestPrice}
              </h5>
              <div className="hotel-rate">
                <span className="hotel-rate-point">
                  {hotel.rating.toFixed(1)}
                </span>
                <span className="hotel-rate-text">Excellent</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
