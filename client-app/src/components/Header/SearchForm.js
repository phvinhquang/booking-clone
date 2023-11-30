import "./SearchForm.css";
import Button from "../../UI/Button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchActions } from "../../store/search";

// Date range
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";

function SearchForm(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cityHasError, setCityHasError] = useState(false);

  const city = useSelector((state) => state.search.city);

  const options = {
    adult: useSelector((state) => state.search.adult),
    children: useSelector((state) => state.search.children),
    room: useSelector((state) => state.search.room),
  };

  // Date range State
  const [date, setDate] = useState([
    {
      startDate: new Date(useSelector((state) => state.search.dateStart)),
      endDate: new Date(useSelector((state) => state.search.dateEnd)),
      key: "selection",
    },
  ]);

  // Hiện date range khi nhấn vào input date
  const [showDateRange, setShowDateRange] = useState(false);
  const openDateRangeHandler = function () {
    setShowDateRange(!showDateRange);
    setShowOptions(false);
  };

  //Hiện options khi nhấn vào options
  const [showOptions, setShowOptions] = useState(false);
  const openOptionsHandler = function () {
    setShowOptions(!showOptions);
    setShowDateRange(false);
  };

  const cityChangeHandler = function (e) {
    setCityHasError(false);
    dispatch(searchActions.setCityValue(e.target.value));
  };

  //Xử lý sự kiện nút Search
  const searchHandler = function (e) {
    e.preventDefault();
    setShowDateRange(false);
    setShowOptions(false);
    setCityHasError(false);

    // Kiểm tra người dùng đã nhập điểm đến chưa
    if (city === "") {
      setCityHasError(true);
      window.alert("Bạn cần nhập điểm đến");
      return;
    }
    // Nếu đã nhập thì chuyển hướng tới trang search
    navigate("/search");

    // Data để gửi request
    const formData = {
      city: city,
      dateStart: format(date[0].startDate, "yyyy-MM-dd"),
      dateEnd: format(date[0].endDate, "yyyy-MM-dd"),
      people: Number(options.adult) + Number(options.children),
      room: options.room,
    };

    const searchRequest = async function () {
      dispatch(searchActions.setSearching());

      try {
        const request = await fetch("http://localhost:5000/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await request.json();
        console.log(data);
        dispatch(searchActions.setResult(data));
      } catch (err) {}

      dispatch(searchActions.setNotSearching());
    };

    searchRequest();
  };

  //Hàm thay đổi options
  const counterHandler = function (e, name, option) {
    e.preventDefault();

    dispatch(searchActions.setOptionsValues({ name: name, option: option }));
  };

  const classes = "form " + props.className;

  return (
    <form className={classes}>
      <div className="input input-place">
        <i className="fa-solid fa-bed"></i>
        <input
          type="text"
          placeholder="Where are you going"
          onChange={cityChangeHandler}
          value={city}
        />
      </div>
      <div className="input input-date">
        <i className="fa-solid fa-calendar"></i>

        <span onClick={openDateRangeHandler}>{`${format(
          date[0].startDate,
          "dd/MM/yy"
        )} to ${format(date[0].endDate, "dd/MM/yy")} `}</span>

        {showDateRange && (
          <DateRange
            className="date-range"
            editableDateInputs={true}
            onChange={(item) => {
              setDate([item.selection]);
              dispatch(
                searchActions.setDateValues({
                  dateStart: format(item.selection.startDate, "yyyy-MM-dd"),
                  dateEnd: format(item.selection.endDate, "yyyy-MM-dd"),
                })
              );
            }}
            moveRangeOnFirstSelection={false}
            minDate={new Date()}
            ranges={date}
          />
        )}
      </div>
      <div className="input input-people">
        <i className="fa-solid fa-person"></i>
        <span
          onClick={openOptionsHandler}
        >{`${options.adult} adults · ${options.children} children · ${options.room} room`}</span>

        {showOptions && (
          <div className="options-form">
            <div className="options-form-item">
              <span>Adult</span>
              <div className="options-form-item-actions">
                <button
                  className="form-item-button"
                  onClick={(e) => counterHandler(e, "adult", "decrease")}
                  disabled={options.adult <= 1}
                >
                  -
                </button>
                <span>{options.adult}</span>
                <button
                  className="form-item-button"
                  onClick={(e) => counterHandler(e, "adult", "increase")}
                >
                  +
                </button>
              </div>
            </div>

            <div className="options-form-item">
              <span>Children</span>
              <div className="options-form-item-actions">
                <button
                  className="form-item-button"
                  onClick={(e) => counterHandler(e, "children", "decrease")}
                  disabled={options.children <= 0}
                >
                  -
                </button>
                <span>{options.children}</span>
                <button
                  className="form-item-button"
                  onClick={(e) => counterHandler(e, "children", "increase")}
                >
                  +
                </button>
              </div>
            </div>

            <div className="options-form-item">
              <span>Room</span>
              <div className="options-form-item-actions">
                <button
                  className="form-item-button"
                  onClick={(e) => counterHandler(e, "room", "decrease")}
                  disabled={options.room <= 1}
                >
                  -
                </button>
                <span>{options.room}</span>
                <button
                  className="form-item-button"
                  onClick={(e) => counterHandler(e, "room", "increase")}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Link onClick={searchHandler} className="link-search">
        <Button className="btn-input-form">Search</Button>
      </Link>
    </form>
  );
}

export default SearchForm;
