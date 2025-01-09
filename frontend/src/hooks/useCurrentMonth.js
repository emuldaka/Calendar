export const useCurrentMonth = (currentTime) => {
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

  let monthSlice = currentTime;
  return monthsOrdered[Number(monthSlice) - 1];
};
