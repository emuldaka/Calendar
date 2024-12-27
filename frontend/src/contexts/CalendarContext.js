import React, { createContext, useState } from "react";

export const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");

  return (
    <CalendarContext.Provider
      value={{
        isFormDisplayed,
        setIsFormDisplayed,
        currentTime,
        setCurrentTime,
        currentMonth,
        setCurrentMonth,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
