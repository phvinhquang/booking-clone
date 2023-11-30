import "./Transaction.css";

import Header from "../../components/Header/Header";
import SignUpForm from "../../components/MainContent/SignUpForm";
import Footer from "../../components/MainContent/Footer";
import TransactionsTable from "../../components/Transaction/TransactionsTable";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../users/user-data";

const Transaction = () => {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate("/auth?mode=login");
    }
  }, [token]);

  return (
    <div>
      <Header showJustTop={true} showNav={false} />
      <div className="transactions-container">
        <h1>Your Transactions</h1>
        <TransactionsTable />
      </div>
      <SignUpForm />
      <Footer />
    </div>
  );
};

export default Transaction;
