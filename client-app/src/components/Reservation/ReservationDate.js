// Date range
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchActions } from "../../store/search";
import { reserveActions } from "../../store/reservation";

import classes from "./ReservationDate.module.css";

const ReservationDate = function () {
  const dispatch = useDispatch();

  const [date, setDate] = useState([
    {
      startDate: new Date(useSelector((state) => state.search.dateStart)),
      endDate: new Date(useSelector((state) => state.search.dateEnd)),
      key: "selection",
    },
  ]);

  // startDate: new Date(useSelector((state) => state.search.dateStart)),
  // endDate: new Date(useSelector((state) => state.search.dateEnd)),

  return (
    <div className={classes.date}>
      <h1>Dates</h1>
      <DateRange
        // className="reservation-date-range"
        editableDateInputs={true}
        onChange={(item) => {
          setDate([item.selection]);
          dispatch(
            searchActions.setDateValues({
              dateStart: format(item.selection.startDate, "yyyy-MM-dd"),
              dateEnd: format(item.selection.endDate, "yyyy-MM-dd"),
            })
          );

          dispatch(
            reserveActions.changeDates({
              dateStart: format(item.selection.startDate, "yyyy-MM-dd"),
              dateEnd: format(item.selection.endDate, "yyyy-MM-dd"),
            })
          );
        }}
        moveRangeOnFirstSelection={false}
        minDate={new Date()}
        ranges={date}
      />
    </div>
  );
};

export default ReservationDate;
