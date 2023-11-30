import GerneralInfo from "../components/HomePage/GeneralInfo";
import Transactions from "../components/HomePage/Transactions";

const HomePage = function () {
  return (
    <div>
      <GerneralInfo />
      <Transactions resultsPerPage="8" title="Latest Transaction" />
    </div>
  );
};

export default HomePage;
