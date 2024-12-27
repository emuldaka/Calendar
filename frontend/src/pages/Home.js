import React from "react";
import { useContext } from "react";
import "../App.css";
import InputForm from "../components/InputForm";
import { CalendarContext } from "../contexts/CalendarContext";
import { useState } from "react";
import { useCurrentMonth } from "../hooks/useCurrentMonth";

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
  } = useContext(CalendarContext);

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

    let arr = [];
    for (let i = 1; i <= monthDays[Number(currentMonth) - 1]; i++) {
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

  return (
    <>
      <h2 className="title">CALENDAR </h2>
      <h2 className="currentMonth">
        {useCurrentMonth(currentTime)} {currentTime.substring(0, 4)}
      </h2>

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
