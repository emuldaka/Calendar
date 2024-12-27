import React, { createContext, useState } from "react";
import { useCurrentMonth } from "../hooks/useCurrentMonth";

export const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [cellYear, setCellYear] = useState("");
  const [cellMonth, setCellMonth] = useState("");
  const [cellDay, setCellDay] = useState("");
  const [monthPagination, setMonthPagination] = useState(
    useCurrentMonth(currentTime)
  );

  return (
    <CalendarContext.Provider
      value={{
        isFormDisplayed,
        setIsFormDisplayed,
        currentTime,
        setCurrentTime,
        currentMonth,
        setCurrentMonth,
        cellDay,
        setCellDay,
        cellMonth,
        setCellMonth,
        cellYear,
        setCellYear,
        monthPagination,
        setMonthPagination,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
