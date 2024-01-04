import "./Search.css";

import { useCallback, useEffect, useState } from "react";
import SearchPopup from "../../components/SearchPage/SearchPopup";
import SearchList from "../../components/SearchPage/SearchList";
import Header from "../../components/Header/Header";
import SignUpForm from "../../components/MainContent/SignUpForm";
import Footer from "../../components/MainContent/Footer";
import LoadingIndicator from "../../UI/LoadingIndicator";
import { useSelector, useDispatch } from "react-redux";

import { searchActions } from "../../store/search";
import { url } from "../../utils/backendUrl";

const Search = () => {
  const isSearching = useSelector((state) => state.search.isSearching);
  const formData = JSON.parse(sessionStorage.getItem("searchForm"));
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const searchRequest = useCallback(
    async function (formData) {
      setIsLoading(true);

      try {
        const request = await fetch(`${url}/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await request.json();
        // console.log(data);
        dispatch(searchActions.setResult(data));
      } catch (err) {}

      setIsLoading(false);
      dispatch(searchActions.setNotSearching());
    },
    [dispatch]
  );

  // Thực hiện search
  useEffect(() => {
    searchRequest(formData);
  }, [isSearching]);

  return (
    <div>
      <Header />
      <div className="container">
        {isLoading && <LoadingIndicator />}
        {!isLoading && (
          <>
            <SearchPopup />
            <SearchList />
          </>
        )}
      </div>
      <SignUpForm />
      <Footer />
    </div>
  );
};

export default Search;
