import classes from "./Transactions.module.css";

import { useEffect, useState, useCallback } from "react";
import { tokenLoader } from "../../utils/auth";
import { format } from "date-fns";

import Card from "../../UI/Card";
import Table from "../../UI/Table";

const Transactions = function ({ resultsPerPage, title }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = tokenLoader();

  // Hàm fetch transaction của người dùng
  const fetchTransactions = useCallback(async function () {
    setIsLoading(true);

    let url = `http://localhost:5000/admin/transactions/latest?resultsPerPage=${resultsPerPage}`;
    if (!resultsPerPage) {
      url = `http://localhost:5000/admin/transactions/all`;
    }

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();

      setTransactions(data.results);
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);

  //Thay đổi format cho date
  const convertDate = function (data) {
    const result = new Date(data);

    return format(result, "dd/MM/yyyy");
  };

  // Hiển thị và set className cho status
  const setStatus = function (dateStartData, dateEndData) {
    const today = new Date();
    const dateStart = new Date(dateStartData);
    const dateEnd = new Date(dateEndData);

    let text = "Booked";
    if (today < dateStart) {
      text = "Booked";
    }

    if (today.getDate() === dateStart.getDate()) {
      text = "Checkin";
    }

    if (today > dateEnd) {
      text = "Checkout";
    }

    return text;
  };

  return (
    <Card className={classes["transactions-card"]}>
      <div className={classes.container}>
        <h2>{title}</h2>

        {isLoading && <p>Loading transactions ...</p>}
        {!isLoading && (
          <Table
            // className={classes.table}
            resultsPerPage={transactions.length}
            totalPage="1"
          >
            <thead>
              <tr>
                <th className={classes.checkbox}>
                  <input type="checkbox" />
                </th>
                <th>
                  <p>ID</p>
                </th>
                <th>
                  <p>User</p>
                </th>
                <th>
                  <p>Hotel</p>
                </th>
                <th>
                  <p>Room</p>
                </th>
                <th>
                  <p>Date</p>
                </th>
                <th>
                  <p>Price</p>
                </th>
                <th className={classes["payment-column"]}>
                  <p>Payment Method</p>
                </th>
                <th>
                  <p>Status</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className={classes.checkbox}>
                    <input type="checkbox" />
                  </td>
                  <td>{transaction._id}</td>
                  <td>{transaction.user}</td>
                  <td>{transaction.hotel.name}</td>
                  <td>
                    {" "}
                    {transaction.room.map((r, i) => (
                      <span key={i}>
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
                  <td className={classes.status}>
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
          </Table>
        )}
      </div>
    </Card>
  );
};

export default Transactions;
