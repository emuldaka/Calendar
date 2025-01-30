function determineEmptyCells(year, month) {
  if (month <= 2) {
    month += 12;
    year -= 1;
  }

  const dayOfMonth = 1;
  const yearInCentury = year % 100;
  const century = Math.floor(year / 100);

  const startOfMonth =
    (dayOfMonth +
      Math.floor((13 * (month + 1)) / 5) +
      yearInCentury +
      Math.floor(yearInCentury / 4) +
      Math.floor(century / 4) -
      2 * century) %
    7;

  return startOfMonth;
}

export default determineEmptyCells;
