import Header from "../../components/Header/Header";
import Cities from "../../components/MainContent/Cities";
import Type from "../../components/MainContent/Type";
import Hotels from "../../components/MainContent/Hotels";
import SignUpForm from "../../components/MainContent/SignUpForm";
import Footer from "../../components/MainContent/Footer";
import { useEffect, useState } from "react";

const Home = () => {
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [topRate, setTopRate] = useState([]);

  // Hàm fetch thông tin chung
  const fetchOverallInfo = async function () {
    try {
      const res = await fetch(
        "https://booking-clone-server-xe8f.onrender.com/overall"
      );
      const data = await res.json();

      setCities(data.hotelsByCities);
      setTypes(data.types);
      setTopRate(data.topRate.slice(0, 3));
    } catch (err) {}
  };

  useEffect(() => {
    fetchOverallInfo();
  });

  return (
    <div>
      <Header />
      <main className="main-page">
        <Cities citiesData={cities} />
        <Type types={types} />
        <Hotels hotels={topRate} />
        <SignUpForm />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
