import React from "react";
import { useContext } from "react";
import "../App.css";
import InputForm from "../components/InputForm";
import { CalendarContext } from "../contexts/CalendarContext";

function Home() {
  const { isFormDisplayed, setIsFormDisplayed, currentTime, setCurrentTime } =
    useContext(CalendarContext);

  function handleClick() {
    console.log("button is clicked");
    setIsFormDisplayed(true);
    const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setCurrentTime(now);
    console.log(currentTime);
  }

  function emptyCells() {
    let arr = [];
    for (let i = 0; i <= 30; i++) {
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
