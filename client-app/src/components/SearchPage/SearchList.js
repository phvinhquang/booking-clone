import classes from "./SearchList.module.css";
import SearchListItem from "./SearchListItem";
import { useSelector } from "react-redux";

function SearchList() {
  const searchData = useSelector((state) => state.search.result);
  const isSearching = useSelector((state) => state.search.isSearching);

  return (
    <div>
      {isSearching && (
        <p className={classes["searching-text"]}>Loading hotels for you ...</p>
      )}
      {!isSearching && (
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
      )}
    </div>
  );
}

export default SearchList;
