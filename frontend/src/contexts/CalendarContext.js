import React, { createContext, useState } from "react";

export const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [cellMonth, setCellMonth] = useState("");
  const [cellDay, setCellDay] = useState("");

  const [monthPagination, setMonthPagination] = useState(
    Number(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
        .substring(5, 7)
    )
  );

  const [yearPagination, setYearPagination] = useState(
    Number(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
        .substring(0, 4)
    )
  );

  return (
    <CalendarContext.Provider
      value={{
        isFormDisplayed,
        setIsFormDisplayed,
        currentTime,
        setCurrentTime,
        cellDay,
        setCellDay,
        cellMonth,
        setCellMonth,
        monthPagination,
        setMonthPagination,
        yearPagination,
        setYearPagination,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
