import React, { createContext, useState } from "react";

export const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");

  function determineCurrentMonth() {
    const January = 31;
    const Febuary = 28;
    const March = 31;
    const April = 30;
    const May = 31;
    const June = 30;
    const July = 31;
    const August = 31;
    const September = 30;
    const October = 31;
    const November = 30;
    const December = 31;

    setCurrentMonth(currentTime.substring(5, 7));
    console.log(currentMonth);
    switch (currentMonth) {
      case "01":
        setCurrentMonth("January");
        break;
      case "02":
        setCurrentMonth("Febuary");
        break;
      case "03":
        setCurrentMonth("March");
        break;
      case "04":
        setCurrentMonth("April");
        break;
      case "05":
        setCurrentMonth("May");
        break;
      case "06":
        setCurrentMonth("June");
        break;
      case "07":
        setCurrentMonth("July");
        break;
      case "08":
        setCurrentMonth("August");
        break;
      case "09":
        setCurrentMonth("September");
        break;
      case "10":
        setCurrentMonth("October");
        break;
      case "11":
        setCurrentMonth("November");
        break;
      case "12":
        setCurrentMonth("December");
        break;
      default:
        console.log("month input from date is not in range of 01-12");
    }
  }

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
