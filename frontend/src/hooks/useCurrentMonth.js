import { useState } from "react";

export const useCurrentMonth = (currentTime) => {
  const [currentMonth, setCurrentMonth] = useState("");

  const monthsOrdered = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let monthSlice = currentTime.substring(5, 7);
  console.log(monthSlice);
  console.log(monthsOrdered[Number(monthSlice) - 1]);
  return monthsOrdered[Number(monthSlice) - 1];
};
