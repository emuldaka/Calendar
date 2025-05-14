import React, { useContext, useEffect } from "react";
import DatePicker from "react-datepicker";
import { CalendarContext } from "../contexts/CalendarContext";
import "react-datepicker/dist/react-datepicker.css";

export const DateSelecter = () => {
  const { dateTime, setDateTime, currentCellDate } =
    useContext(CalendarContext);

  useEffect(() => {
    if (currentCellDate) {
      const now = new Date();
      const parsedDate = new Date(currentCellDate);

      if (!isNaN(parsedDate)) {
        const useThisDate = parsedDate < now ? now : parsedDate;

        setDateTime(useThisDate);
      }
    }
  }, [currentCellDate, setDateTime]); // 🔥 Removed dateTime from dependency array

  const now = new Date();

  return (
    <div className="DatePickerWrapper">
      <DatePicker
        className="DatePicker"
        minDate={now}
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
