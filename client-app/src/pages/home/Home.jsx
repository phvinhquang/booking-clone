import Header from "../../components/Header/Header";
import Cities from "../../components/MainContent/Cities";
import Type from "../../components/MainContent/Type";
import Hotels from "../../components/MainContent/Hotels";
import SignUpForm from "../../components/MainContent/SignUpForm";
import Footer from "../../components/MainContent/Footer";
import LoadingIndicator from "../../UI/LoadingIndicator";
import { useEffect, useState, useCallback } from "react";
import { url } from "../../utils/backendUrl";
import "./Home.css";

const Home = () => {
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [topRate, setTopRate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm fetch thông tin chung
  const fetchOverallInfo = useCallback(async function () {
    setIsLoading(true);

    try {
      const res = await fetch(`${url}/overall`);
      const data = await res.json();

      setCities(data.hotelsByCities);
      setTypes(data.types);
      setTopRate(data.topRate.slice(0, 3));
    } catch (err) {}

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOverallInfo();
  }, [fetchOverallInfo]);

  return (
    <div>
      <Header isLoading={isLoading} />
      <main className="main-page">
        {isLoading && (
          <>
            <LoadingIndicator className="home-loading" />
            <p
              style={{
                textAlign: "center",
                fontSize: "24px",
                marginTop: "20px",
              }}
            >
              Due to Render FREE HOSTING SERVIRE, this might take a few minutes.
              Please wait ...
            </p>
          </>
        )}
        {!isLoading && (
          <>
            <Cities citiesData={cities} />
            <Type types={types} />
            <Hotels hotels={topRate} />
            <SignUpForm />
          </>
        )}
      </main>
      {!isLoading && <Footer />}
    </div>
  );
};

export default Home;
