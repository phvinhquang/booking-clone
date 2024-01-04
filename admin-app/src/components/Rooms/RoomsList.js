import { Link } from "react-router-dom";
import classes from "./RoomsList.module.css";
import Table from "../../UI/Table";
import LoadingIndicator from "../../UI/LoadingIndicator";
import { useState, useCallback, useEffect } from "react";
import { tokenLoader } from "../../utils/auth";
import { url } from "../../utils/backendUrl";

const RoomsList = function () {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState({ delete: false, id: null });

  const token = tokenLoader();

  // Hàm fetch all rooms
  const fetchRooms = useCallback(async function () {
    setIsLoading(true);

    try {
      const res = await fetch(`${url}/admin/rooms`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
      setRooms(data);
    } catch (err) {}

    setIsLoading(false);
  }, []);

  // Hàm request xóa hotel
  const deleteRoom = async function (requestData, roomId) {
    setIsDeleting({ delete: true, id: roomId });

    try {
      const req = await fetch(`${url}/admin/delete-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(requestData),
      });

      const data = await req.json();

      if (req.status === 409) {
        window.alert(data);
      }

      if (req.status === 201) {
        window.alert(data);
        fetchRooms();
      }
    } catch (err) {}

    setIsDeleting({ delete: false, id: null });
  };

  // Thực hiện fetch hotel
  useEffect(() => {
    fetchRooms();
  }, []);

  // Xử lý sự kiện delete
  const roomDeleteHandler = function (roomId) {
    setError(null);

    const data = { roomId: roomId };

    const confirm = window.confirm("Bạn có chắc muốn xóa phòng này không ?");
    if (confirm) {
      deleteRoom(data, roomId);
    } else {
      return;
    }
  };

  return (
    <div>
      <div className={classes.header}>
        <h1>Rooms List</h1>
        <div>
          <Link to="/new-room">
            <button type="button" className={classes["btn-new"]}>
              Add New
            </button>
          </Link>
        </div>
      </div>

      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <Table
          resultsPerPage={rooms.length}
          totalPage="1"
          className={classes["rooms-list-table"]}
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
                <p>Title</p>
              </th>
              <th>
                <p>Description</p>
              </th>
              <th>
                <p>Price</p>
              </th>
              <th>
                <p>Max People</p>
              </th>
              <th>
                <p>Action</p>
              </th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room._id}>
                <td className={classes.checkbox}>
                  <input type="checkbox" />
                </td>
                <td>{room._id}</td>
                <td>{room.title}</td>
                <td className={classes.desc}>{room.desc}</td>
                <td>{room.price}</td>
                <td className={classes["max-people"]}>{room.maxPeople}</td>
                <td>
                  <button
                    onClick={roomDeleteHandler.bind(this, room._id)}
                    className={classes["btn-delete"]}
                    type="button"
                  >
                    {isDeleting.delete && isDeleting.id === room._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                  <Link to={`/new-room?mode=edit&id=${room._id}`}>
                    <button type="button" className={classes["btn-new"]}>
                      {" "}
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default RoomsList;
