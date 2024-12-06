import React, { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";
import { MdDelete } from "react-icons/md";

function InputForm() {
  const [dateTime, setDateTime] = useState("");
  const [entryText, setEntryText] = useState("");

  const { setIsFormDisplayed, currentTime } = useContext(CalendarContext);

  function handleClick() {
    setIsFormDisplayed(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(entryText + " @", dateTime);
  }

  function handleDeleteClick(e) {
    e.preventDefault();
    console.log("events deleted");
  }

  function handleChange(e) {
    setDateTime(e.target.value);
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
            <input
              className="addEventText"
              type="text"
              name=""
              id=""
              onChange={(e) => setEntryText(e.target.value)}
              value={entryText}
              required
            />
            <label for="meeting-time">Choose your event:</label>
            <input
              type="datetime-local"
              id="meeting-time"
              name="meeting-time"
              value={dateTime}
              min={currentTime}
              max="2099-06-14T00:00"
              onChange={handleChange}
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
