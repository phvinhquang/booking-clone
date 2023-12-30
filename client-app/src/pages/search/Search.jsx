import "./Search.css";

import SearchPopup from "../../components/SearchPage/SearchPopup";
import SearchList from "../../components/SearchPage/SearchList";
import Header from "../../components/Header/Header";
import SignUpForm from "../../components/MainContent/SignUpForm";
import Footer from "../../components/MainContent/Footer";
import LoadingIndicator from "../../UI/LoadingIndicator";
import { useSelector } from "react-redux";
import { is } from "date-fns/locale";

const Search = () => {
  const isSearching = useSelector((state) => state.search.isSearching);

  return (
    <div>
      <Header />
      <div className="container">
        {isSearching && <LoadingIndicator />}
        {!isSearching && (
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
