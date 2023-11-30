import "./Search.css";

import SearchPopup from "../../components/SearchPage/SearchPopup";
import SearchList from "../../components/SearchPage/SearchList";
import Header from "../../components/Header/Header";
import SignUpForm from "../../components/MainContent/SignUpForm";
import Footer from "../../components/MainContent/Footer";

const Search = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <SearchPopup />
        <SearchList />
      </div>
      <SignUpForm />
      <Footer />
    </div>
  );
};

export default Search;
