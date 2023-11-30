import "./Type.css";
import typesImgs from "../../data/type.json";

function Type({ types }) {
  return (
    <div className="types-container">
      <h1>Browse by property type</h1>
      <div className="types-flex">
        {types.map((type, i) => (
          <div className="type" key={i}>
            {typesImgs.map((img, index) => {
              if (i === index) {
                return <img key={index} className="type-img" src={img.image} />;
              }
            })}

            <div className="type-text">
              <h3>{type.type}</h3>
              <h3>
                {type.number} {type.type.toLowerCase()}(s)
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Type;
