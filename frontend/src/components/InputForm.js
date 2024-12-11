import React, { useRef, useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";
import { useEventSubmit } from "../hooks/useEventSubmit";
import Event from "./Event";
import { MdDelete } from "react-icons/md";

function InputForm() {
  const [dateTime, setDateTime] = useState("");
  const [entryText, setEntryText] = useState("");
  const [currentEvents, setCurrentEvents] = useState([]);
  const { eventSubmit, error, isLoading } = useEventSubmit();
  const [isChecked, setIsChecked] = useState(false);

  const { setIsFormDisplayed, currentTime } = useContext(CalendarContext);

  const divRef = useRef(null);

  useEffect(() => {
    fetchCurrentEvents();
  }, []);

  useEffect(() => {
    console.log(divRef);
  }, [divRef]);

  async function fetchCurrentEvents() {
    const response = await fetch("http://localhost:5000/api/events");
    const json = await response.json();
    if (response.ok) {
      setCurrentEvents(json);
    }
  }

  function handleClick() {
    setIsFormDisplayed(false);
  }

  function eventsArrayPopulator() {
    let eventsArray = [];

    for (let i = 0; i <= currentEvents.length - 1; i++) {
      eventsArray.push(
        <Event
          id={i}
          title={currentEvents[i]?.title}
          date={currentEvents[i]?.date}
        />
      );
    }
    console.log(eventsArray);
    return eventsArray;
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(entryText + " @", dateTime);
    eventSubmit(entryText, dateTime);
  }

  function handleDeleteClick(e) {
    e.preventDefault();
    console.log(e.target.value);
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
            <label for="meeting-time">Choose your date:</label>
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
            <div className="currentEvents">{eventsArrayPopulator()}</div>
          </form>
        </div>
      </div>
    </>
  );
}

export default InputForm;
