import React, { createContext, useState } from "react";

export const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);

  return (
    <CalendarContext.Provider value={{ isFormDisplayed, setIsFormDisplayed }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
