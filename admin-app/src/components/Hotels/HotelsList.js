import classes from "./HotelsList.module.css";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Table from "../../UI/Table";
import { tokenLoader } from "../../utils/auth";

const HotelsList = function () {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState({ delete: false, id: null });

  const token = tokenLoader();

  // Hàm fetch all hotel
  const fetchHotels = useCallback(async function () {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://booking-clone-server-xe8f.onrender.com/admin/hotels`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();
      setHotels(data);
    } catch (err) {}

    setIsLoading(false);
  }, []);

  // Hàm request xóa hotel
  const deleteHotel = async function (requestData, hotelId) {
    setIsDeleting({ delete: true, id: hotelId });

    try {
      const req = await fetch(
        `https://booking-clone-server-xe8f.onrender.com/admin/delete-hotel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await req.json();

      if (req.status === 409) {
        setError(data);
      }

      if (req.status === 201) {
        fetchHotels();
      }
    } catch (err) {}

    setIsDeleting({ delete: false, id: null });
  };

  // Thực hiện fetch hotel
  useEffect(() => {
    fetchHotels();
  }, []);

  // Xóa thông báo lỗi sau 3s
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error]);

  // Xử lý sự kiện delete
  const hotelDeleteHandler = function (hotelId) {
    setError(null);

    const data = { hotelId: hotelId };

    const confirm = window.confirm(
      "Bạn có chắc muốn xóa khách sạn này không ?"
    );
    if (confirm) {
      deleteHotel(data, hotelId);
    } else {
      return;
    }
  };

  return (
    <div>
      <div className={classes.header}>
        <h1>Hotels List</h1>
        <div>
          <button type="button" className={classes["btn-new"]}>
            <Link to="/new-hotel">Add New</Link>
          </button>
        </div>
      </div>

      <div className={classes["hotels-list-container"]}>
        {isLoading && <p>Loading Hotels List ...</p>}
        {!isLoading && (
          <Table resultsPerPage={hotels.length} totalPage="1">
            <thead>
              <tr>
                <th className={classes.checkbox}>
                  <input type="checkbox" />
                </th>
                <th>
                  <p>ID</p>
                </th>
                <th>
                  <p>Name</p>
                </th>
                <th>
                  <p>Type</p>
                </th>
                <th>
                  <p>Title</p>
                </th>
                <th>
                  <p>City</p>
                </th>
                <th>
                  <p>Action</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id}>
                  <td className={classes.checkbox}>
                    <input type="checkbox" />
                  </td>
                  <td className={classes["id-column"]}>{hotel._id}</td>
                  <td>{hotel.name}</td>
                  <td>{hotel.type}</td>
                  <td>{hotel.title}</td>
                  <td>{hotel.city}</td>
                  <td>
                    <button
                      onClick={hotelDeleteHandler.bind(this, hotel._id)}
                      className={classes["btn-delete"]}
                    >
                      {isDeleting.delete && isDeleting.id === hotel._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                    <Link to={`/new-hotel?mode=edit&id=${hotel._id}`}>
                      <button type="button" className={classes["btn-new"]}>
                        Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {error && <p className={classes["error-delete"]}>{error}</p>}
      </div>
    </div>
  );
};

export default HotelsList;
