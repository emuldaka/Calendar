import React, { createContext, useState } from "react";

export const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  return (
    <CalendarContext.Provider
      value={{
        isFormDisplayed,
        setIsFormDisplayed,
        currentTime,
        setCurrentTime,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
