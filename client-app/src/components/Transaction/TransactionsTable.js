import React, { useEffect, useCallback, useState } from "react";
import classes from "./TransactionsTable.module.css";
import { getToken } from "../../users/user-data";
import { format } from "date-fns";

const TransactionsTable = function () {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = getToken();

  // Hàm fetch transaction của người dùng
  const fetchTransactions = useCallback(
    async function () {
      setIsLoading(true);

      try {
        const res = await fetch(`http://localhost:5000/transactions`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (!res.ok) {
          throw new Error("Sorry, something went wrong :(");
        }

        const data = await res.json();

        setTransactions(data);
      } catch (err) {
        setError(err.message);
      }

      setIsLoading(false);
    },
    [token]
  );

  useEffect(() => {
    fetchTransactions();
  }, []);

  //Thay đổi format cho date
  const convertDate = function (data) {
    const result = new Date(data);

    return format(result, "dd/MM/yyyy");
  };

  const setStatus = function (dateStartData, dateEndData) {
    const today = new Date();
    const dateStart = new Date(dateStartData);
    const dateEnd = new Date(dateEndData);

    let text = "";
    if (today < dateStart) {
      text = "Booked";
    }

    if (today.getDate() === dateStart.getDate()) {
      text = "Checkin";
    }

    if (today > dateEnd) {
      text = "Checkout";
    }

    text = "Booked";
    return text;
  };

  return (
    <>
      {error && <p className={classes.error}>{error}</p>}
      {isLoading && (
        <p className={classes.loading}>Loading your transactions...</p>
      )}
      {transactions.length === 0 && !isLoading && (
        <p className={classes.loading}>Bạn chưa có giao dịch nào</p>
      )}
      {!isLoading && transactions.length > 0 && (
        <table className={classes.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Hotel</th>
              <th>Room</th>
              <th>Date</th>
              <th>Price</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, i) => (
              <tr key={i} className={`${i % 2 === 0 && classes.gray}`}>
                <td className={classes.number}>
                  {i + 1 < 10 ? "0" : ""}
                  {i + 1}
                </td>
                <td>{transaction.hotel.title}</td>
                <td>
                  {transaction.room.map((r, i) => (
                    <span key={r.roomNumbers}>
                      {i !== 0 && ", "}
                      {r.roomNumbers.join(", ")}
                    </span>
                  ))}
                </td>
                <td>
                  {convertDate(transaction.dateStart)} -{" "}
                  {convertDate(transaction.dateEnd)}
                </td>
                <td>${transaction.price.toLocaleString("de-DE")}</td>
                <td>{transaction.payment}</td>
                <td>
                  <span
                    className={
                      classes[
                        `${setStatus(
                          transaction.dateStart,
                          transaction.dateEnd
                        ).toLowerCase()}`
                      ]
                    }
                  >
                    {setStatus(transaction.dateStart, transaction.dateEnd)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TransactionsTable;
