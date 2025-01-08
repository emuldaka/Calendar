import React, { useEffect } from "react";
import { useContext } from "react";
import "../App.css";
import InputForm from "../components/InputForm";
import { CalendarContext } from "../contexts/CalendarContext";
import { useState } from "react";
import { useCurrentMonth } from "../hooks/useCurrentMonth";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

function Home() {
  const {
    isFormDisplayed,
    setIsFormDisplayed,
    currentTime,
    setCurrentTime,
    currentMonth,
    setCurrentMonth,
    setCellDay,
    setCellMonth,
    setCellYear,
    monthPagination,
    setMonthPagination,
    yearPagination,
    setYearPagination,
  } = useContext(CalendarContext);
  const [emptyCellStartDates, setEmptyCellStartDates] = useState([
    3, 6, 6, 2, 4, 7, 2, 5, 1, 3, 6, 1,
  ]);

  const [monthDays, setMonthDays] = useState([
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ]);

  const [monthlyFetch, setMonthlyFetch] = useState([]);

  const [currentCellDate, setCurrentCellDate] = useState("");

  useEffect(() => {
    fetchCurrentEvents(yearPagination, monthPagination);
  }, [monthPagination, yearPagination, emptyCellStartDates]);

  const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  setCurrentTime(now);

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

  function handleClick(e) {
    e.preventDefault();
    console.log("button is clicked");
    setCellDay(e.target.id);
    setCellMonth(currentMonth);
    setCellYear(currentTime.substring(0, 4));
    setIsFormDisplayed(true);
    const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setCurrentTime(now);
    setCurrentCellDate(
      `${monthsOrdered[monthPagination - 1]} ${e.target.id} ${yearPagination}`
    );
    console.log("currentCellDate", currentCellDate);
    console.log(now);
    console.log(e.target.id);
  }

  let monthSlice = currentTime.substring(5, 7);

  setCurrentMonth(monthSlice);

  async function fetchCurrentEvents(yearPagination, monthPagination) {
    console.log(yearPagination);
    console.log(monthPagination);
    let month = 0;
    if (Number(monthPagination) < 10) {
      month = "0" + monthPagination.toString();
    } else {
      month = monthPagination;
    }
    console.log(month);

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/month/${yearPagination}-${month}`
      );
      const json = await response.json();
      if (response.ok) {
        let fetchResponse = json;
        let arr = [];
        for (let i = 0; i < Object.keys(fetchResponse).length; i++) {
          arr.push(fetchResponse[i].date.substring(8, 10));
        }
        console.log("fetched", arr);
        setMonthlyFetch(arr);
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  function emptyCells() {
    let arr = [];

    for (let j = 1; j < emptyCellStartDates[monthPagination - 1]; j++) {
      arr.push(
        <div className="cell">
          <div className="cellTextContainer">
            <div className="cellText"></div>
          </div>
        </div>
      );
    }

    for (let i = 1; i <= monthDays[monthPagination - 1]; i++) {
      let result = "";
      if (i < 10) {
        i = "0" + i.toString();
      }
      i = i.toString();
      const count = monthlyFetch.filter((element) => element === i).length;
      if (count > 0) {
        result = count;
      }

      arr.push(
        <div className="cell" key={i}>
          <div className="cellTextContainer">
            <div className="cellText">{i}</div>
            <div className="resultDiv">
              {result === 1 ? `1 Event` : result > 0 ? `${result} Events` : ""}
            </div>
          </div>
          <button className="editButton" onClick={handleClick} id={i}>
            View/Edit
          </button>
        </div>
      );
    }
    return arr;
  }

  function isNextYearLeapYear() {
    if ((yearPagination + 1) % 4 === 0 && (yearPagination + 1) % 100 === 0) {
      if ((yearPagination + 1) % 400 === 0) {
        return true;
      } else {
        return false;
      }
    } else if (
      (yearPagination + 1) % 4 === 0 &&
      (yearPagination + 1) % 100 !== 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  function isCurrentYearLeapYear() {
    if (yearPagination % 4 === 0 && yearPagination % 100 === 0) {
      if (yearPagination % 400 === 0) {
        return true;
      } else {
        return false;
      }
    } else if (yearPagination % 4 === 0 && yearPagination % 100 !== 0) {
      return true;
    } else {
      return false;
    }
  }

  function isLastYearLeapYear() {
    if ((yearPagination - 1) % 4 === 0 && (yearPagination - 1) % 100 === 0) {
      if ((yearPagination - 1) % 400 === 0) {
        return true;
      } else {
        return false;
      }
    } else if (
      (yearPagination - 1) % 4 === 0 &&
      (yearPagination - 1) % 100 !== 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  function leftPagination() {
    console.log("left arrow clicked");
    let emptyCellsArr = [];
    if (monthPagination === 1 && isLastYearLeapYear()) {
      setMonthDays([31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
      setMonthPagination(12);
      setYearPagination(yearPagination - 1);
      for (let i = 0; i < emptyCellStartDates.length; i++) {
        if (emptyCellStartDates[i] > 1) {
          emptyCellsArr.push(emptyCellStartDates[i] - 1);
        } else if (emptyCellStartDates[i] === 1) {
          emptyCellsArr.push(7);
        }
      }
      emptyCellsArr[0] = emptyCellsArr[0] + 1;
      emptyCellsArr[1] = emptyCellsArr[1] + 1;
      setEmptyCellStartDates(emptyCellsArr);
    } else if (monthPagination === 1 && isCurrentYearLeapYear()) {
      setMonthDays([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
      setMonthPagination(12);
      setYearPagination(yearPagination - 1);
      for (let i = 0; i < emptyCellStartDates.length; i++) {
        if (emptyCellStartDates[i] > 2) {
          emptyCellsArr.push(emptyCellStartDates[i] - 2);
        } else if (emptyCellStartDates[i] === 2) {
          emptyCellsArr.push(7);
        } else if (emptyCellStartDates[i] === 1) {
          emptyCellsArr.push(6);
        }
      }
      setEmptyCellStartDates(emptyCellsArr);
    } else if (monthPagination === 1) {
      setMonthDays([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
      setMonthPagination(12);
      setYearPagination(yearPagination - 1);
      for (let i = 0; i < emptyCellStartDates.length; i++) {
        if (emptyCellStartDates[i] > 1) {
          emptyCellsArr.push(emptyCellStartDates[i] - 1);
        } else if (emptyCellStartDates[i] === 1) {
          emptyCellsArr.push(7);
        }
      }
      setEmptyCellStartDates(emptyCellsArr);
    } else {
      setMonthPagination(monthPagination - 1);
    }
    console.log(monthPagination);
    console.log(emptyCellsArr);
    console.log(emptyCellStartDates);
  }

  function rightPagination() {
    console.log("right arrow clicked");
    let emptyCellsArr = [];
    if (monthPagination === 12 && isNextYearLeapYear()) {
      setMonthDays([31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
      setMonthPagination(1);
      setYearPagination(yearPagination + 1);
      for (let i = 0; i <= emptyCellStartDates.length; i++) {
        if (emptyCellStartDates[i] < 6) {
          emptyCellsArr.push(emptyCellStartDates[i] + 2);
        }
        if (emptyCellStartDates[i] === 6) {
          emptyCellsArr.push(1);
        }
        if (emptyCellStartDates[i] === 7) {
          emptyCellsArr.push(2);
        }
      }
      emptyCellsArr[0] = emptyCellsArr[0] - 1;
      emptyCellsArr[1] = emptyCellsArr[1] - 1;
      setEmptyCellStartDates(emptyCellsArr);
    } else if (monthPagination === 12 && isCurrentYearLeapYear()) {
      setMonthDays([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
      setMonthPagination(1);
      setYearPagination(yearPagination + 1);
      for (let i = 0; i <= emptyCellStartDates.length; i++) {
        if (emptyCellStartDates[i] < 6) {
          emptyCellsArr.push(emptyCellStartDates[i] + 2);
        }
        if (emptyCellStartDates[i] === 6) {
          emptyCellsArr.push(1);
        }
        if (emptyCellStartDates[i] === 7) {
          emptyCellsArr.push(2);
        }
      }
      setEmptyCellStartDates(emptyCellsArr);
    } else if (monthPagination === 12) {
      setMonthDays([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
      setMonthPagination(1);
      setYearPagination(yearPagination + 1);
      for (let i = 0; i <= emptyCellStartDates.length; i++) {
        if (emptyCellStartDates[i] < 7) {
          emptyCellsArr.push(emptyCellStartDates[i] + 1);
        }
        if (emptyCellStartDates[i] === 7) {
          emptyCellsArr.push(1);
        }
      }
      setEmptyCellStartDates(emptyCellsArr);
    } else {
      setMonthPagination(monthPagination + 1);
    }
    console.log(monthPagination);
    console.log(emptyCellsArr);
    console.log(emptyCellStartDates);
  }

  let currentMonthYearDisplay = `${useCurrentMonth(
    monthPagination
  )} ${yearPagination}`;

  return (
    <>
      <h2 className="title">CALENDAR </h2>
      {isFormDisplayed ? (
        <div className="currentMonthCon2">{currentCellDate}</div>
      ) : (
        <>
          <div className="currentMonthCon">
            <button className="pageLeft" onClick={leftPagination}>
              <IoIosArrowBack size={20} />
            </button>
            <h2 className="currentMonth">{currentMonthYearDisplay}</h2>
            <button className="pageRight" onClick={rightPagination}>
              <IoIosArrowForward size={20} />
            </button>
          </div>
        </>
      )}

      {isFormDisplayed ? (
        <InputForm />
      ) : (
        <>
          <div className="days">
            <div className="dayNames">Monday</div>
            <div className="dayNames">Tuesday</div>
            <div className="dayNames">Wednesday</div>
            <div className="dayNames">Thursday</div>
            <div className="dayNames">Friday</div>
            <div className="dayNames">Saturday</div>
            <div className="dayNames">Sunday</div>
          </div>
          <div className="grid-container">{emptyCells()}</div>
        </>
      )}
    </>
  );
}

export default Home;
