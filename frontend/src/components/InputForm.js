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
  const [checkedEvents, setCheckedEvents] = useState({});
  const [currentMonth, setCurrentMonth] = useState();
  const {
    setIsFormDisplayed,
    currentTime,
    cellDay,
    setCellDay,
    cellMonth,
    setCellMonth,
    cellYear,
    setCellYear,
    monthPagination,
    yearPagination,
  } = useContext(CalendarContext);
  const [eventsArray, setEventsArray] = useState([]);

  useEffect(() => {
    fetchCurrentEvents();
  }, []);

  useEffect(() => {
    eventsArrayPopulator();
    console.log(cellYear + "-" + cellMonth + "-" + cellDay);
  }, [currentEvents, checkedEvents]);

  async function fetchCurrentEvents() {
    const response = await fetch(
      `http://localhost:5000/api/events/${yearPagination}-${
        monthPagination < 10 ? "0" + monthPagination : monthPagination
      }-${cellDay}`
    );
    const json = await response.json();
    if (response.ok) {
      setCurrentEvents(json);
    }
  }

  function handleClick() {
    setIsFormDisplayed(false);
  }

  function eventsArrayPopulator() {
    const localEventsArray = currentEvents.map((event) => (
      <Event
        key={event._id}
        id={event._id}
        title={event.title}
        date={event.date}
        isChecked={checkedEvents[event._id] || false}
        handleCheckClick={(id, isChecked) => handleCheckClick(id, isChecked)}
      />
    ));
    setEventsArray(localEventsArray);
  }

  function handleCheckClick(id, isChecked) {
    setCheckedEvents((prev) => ({
      ...prev,
      [id]: isChecked,
    }));
    console.log(checkedEvents);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(entryText + " @", dateTime);
    eventSubmit(entryText, dateTime);
    fetchCurrentEvents();
  }

  async function handleDeleteClick(e) {
    e.preventDefault();
    const idArray = Object.keys(checkedEvents);

    const response = await fetch("http://localhost:5000/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [...idArray] }),
    });
    if (response.ok) {
      console.log([...idArray]);
      fetchCurrentEvents();
      console.log("OOOKAy");
    }
    // console.log("events deleted");
  }

  function handleChange(e) {
    setDateTime(e.target.value);
  }
  // console.log(currentMonth);
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
            <div className="currentEvents">{eventsArray}</div>
          </form>
        </div>
      </div>
    </>
  );
}

export default InputForm;
