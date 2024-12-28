import React from "react";
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
    cellDay,
    setCellDay,
    cellMonth,
    setCellMonth,
    cellYear,
    setCellYear,
    monthPagination,
    setMonthPagination,
    yearPagination,
    setYearPagination,
  } = useContext(CalendarContext);
  const [emptyCellStartDates, setEmptyCellStartDates] = useState([
    3, 6, 6, 2, 4, 7, 2, 5, 1, 3, 6, 1,
  ]);

  const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  setCurrentTime(now);

  function handleClick(e) {
    e.preventDefault();
    console.log("button is clicked");
    if (e.target.id < 10) {
      setCellDay("0" + e.target.id.toString());
    } else {
      setCellDay(e.target.id);
    }
    setCellMonth(currentMonth);
    setCellYear(currentTime.substring(0, 4));
    setIsFormDisplayed(true);
    const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setCurrentTime(now);
    console.log(now);
    console.log(e.target.id);
  }

  let monthSlice = currentTime.substring(5, 7);

  setCurrentMonth(monthSlice);

  function emptyCells() {
    let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // let startDates = [3, 6, 6, 2, 4, 7, 2, 5, 1, 3, 6, 1];

    let arr = [];

    if (yearPagination % 4 === 0) {
      monthDays[1] = 29;
    }

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
      arr.push(
        <div className="cell" key={i}>
          <div className="cellTextContainer">
            <div className="cellText">{i}</div>
          </div>
          <button className="editButton" onClick={handleClick} id={i}>
            View/Edit
          </button>
        </div>
      );
    }
    return arr;
  }

  function leftPagination() {
    console.log("left arrow clicked");
  }

  function rightPagination() {
    console.log("right arrow clicked");
    if (monthPagination === 12) {
      setMonthPagination(1);
      setYearPagination(yearPagination + 1);

      // setEmptyCellStartDates(() => {});

      // for (let i = 0; i <= emptyCellStartDates.length; i++) {
      //   if (emptyCellStartDates[i] < 7) {
      //     setEmptyCellStartDates([emptyCellStartDates[i] + 1]);
      //   }
      //   if (emptyCellStartDates[i] === 7) {
      //     setEmptyCellStartDates([(emptyCellStartDates[i] = 0)]);
      //   }
      // }
    } else {
      setMonthPagination(monthPagination + 1);
    }
    console.log(monthPagination);
  }

  return (
    <>
      <h2 className="title">CALENDAR </h2>
      <div className="currentMonthCon">
        <button className="pageLeft" onClick={leftPagination}>
          <IoIosArrowBack size={20} />
        </button>
        <h2 className="currentMonth">
          {useCurrentMonth(monthPagination)} {yearPagination}
        </h2>
        <button className="pageRight" onClick={rightPagination}>
          <IoIosArrowForward size={20} />
        </button>
      </div>

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
