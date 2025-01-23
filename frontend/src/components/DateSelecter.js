import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import { CalendarContext } from "../contexts/CalendarContext";
import "react-datepicker/dist/react-datepicker.css";

export const DateSelecter = () => {
  const { dateTime, setDateTime } = useContext(CalendarContext);

  return (
    <div className="DatePickerWrapper">
      <DatePicker
        className="DatePicker"
        selected={dateTime}
        onChange={(date) => {
          setDateTime(date);
        }}
        showTimeSelect
        dateFormat="Pp"
      />
    </div>
  );
};
