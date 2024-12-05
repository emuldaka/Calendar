import React from "react";
import { AiFillHome } from "react-icons/ai";
import { useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";
import { MdDelete } from "react-icons/md";

function InputForm() {
  const { isFormDisplayed, setIsFormDisplayed } = useContext(CalendarContext);
  function handleClick() {
    setIsFormDisplayed(false);
    console.log(isFormDisplayed);
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleDeleteClick(e) {
    e.preventDefault();
    console.log("events deleted");
  }

  return (
    <>
      <div className="formOuterContainer">
        <div className="formContainer">
          <div>Event Entry</div>
          <button className="homeButton" onClick={handleClick}>
            <AiFillHome size={34} style={{ height: 40, width: 40 }} />
          </button>
          <form className="addEntry" onSubmit={handleSubmit}>
            <label className="addEvent">Add Event:</label>
            <input type="text" name="" id="" required />
            <label for="meeting-time">
              Choose a time for your appointment:
            </label>
            <input
              type="datetime-local"
              id="meeting-time"
              name="meeting-time"
              value="2018-06-12T19:30"
              min="2024-12-04T00:00"
              // fix that^
              max="2099-06-14T00:00"
            />
            <input className="submitButton" type="submit" />
          </form>
        </div>
        <div className="eventsContainer">
          Current events
          <form className="deleteEvents">
            <button className="delete" onClick={handleDeleteClick}>
              <MdDelete size={34} style={{ height: 40, width: 40 }} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default InputForm;
