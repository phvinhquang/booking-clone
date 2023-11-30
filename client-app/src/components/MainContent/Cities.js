import "./Cities.css";
import HanoiImg from "../../data/City Image/Ha Noi.jpg";
import HcmImg from "../../data/City Image/HCM.jpg";
import DnImg from "../../data/City Image/Da Nang.jpg";

function Cities({ citiesData }) {
  const citiesImgs = [HanoiImg, HcmImg, DnImg];

  return (
    <div className="cities-container">
      {citiesData.map((city, i) => (
        <div key={i} className="city">
          {citiesImgs.map((img, index) => {
            if (i === index) {
              return <img key={index} className="img-city" src={img} />;
            }
          })}

          <div className="city-text">
            <h3>{city.city}</h3>
            <h3>{city.properties} properties</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cities;
