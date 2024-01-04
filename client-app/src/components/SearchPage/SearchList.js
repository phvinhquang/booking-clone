import classes from "./SearchList.module.css";
import SearchListItem from "./SearchListItem";
import LoadingIndicator from "../../UI/LoadingIndicator";
import { useSelector } from "react-redux";

function SearchList() {
  const searchData = useSelector((state) => state.search.result);

  return (
    <div>
      <div className="search-list-container">
        {searchData.map((searchItem, i) => (
          <SearchListItem
            key={searchItem._id}
            id={searchItem._id}
            name={searchItem.name}
            distance={searchItem.distance}
            type={searchItem.type}
            address={searchItem.address}
            price={searchItem.cheapestPrice}
            rate={searchItem.rating}
            img={searchItem.photos[0]}
          ></SearchListItem>
        ))}
      </div>
    </div>
  );
}

export default SearchList;
