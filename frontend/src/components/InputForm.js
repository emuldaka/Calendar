import React, { useEffect, useState, useCallback } from "react";
import { AiFillHome } from "react-icons/ai";
import { useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";
import { useEventSubmit } from "../hooks/useEventSubmit";
import Event from "./Event";
import { MdDelete } from "react-icons/md";
import { DateSelecter } from "./DateSelecter";

function InputForm() {
  const [entryText, setEntryText] = useState("");
  const [currentEvents, setCurrentEvents] = useState([]);
  const { eventSubmit } = useEventSubmit();
  const [checkedEvents, setCheckedEvents] = useState({});
  const {
    setIsFormDisplayed,
    currentTime,
    cellDay,
    monthPagination,
    yearPagination,
    dateTime,
    setDateTime,
  } = useContext(CalendarContext);
  const [eventsArray, setEventsArray] = useState([]);

  const fetchCurrentEvents = useCallback(async () => {
    const response = await fetch(
      `http://localhost:5000/api/events/${yearPagination}-${
        monthPagination < 10 ? "0" + monthPagination : monthPagination
      }-${cellDay}`
    );
    const json = await response.json();
    if (response.ok) {
      setCurrentEvents(json);
    }
  }, [yearPagination, monthPagination, cellDay]);

  useEffect(() => {
    fetchCurrentEvents();
  }, [fetchCurrentEvents]);

  function handleClick() {
    setIsFormDisplayed(false);
  }

  const eventsArrayPopulator = useCallback(() => {
    // Sort the events by date before mapping
    const sortedEvents = [...currentEvents].sort((a, b) => {
      // Compare dates as Date objects (ascending order)
      return new Date(a.date) - new Date(b.date);
    });

    const localEventsArray = sortedEvents.map((event) => (
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
  }, [currentEvents, checkedEvents]);

  useEffect(() => {
    eventsArrayPopulator();
  }, [eventsArrayPopulator]);

  function handleCheckClick(id, isChecked) {
    setCheckedEvents((prev) => ({
      ...prev,
      [id]: isChecked,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let date = new Date(
      new Date(dateTime).getTime() - 12 * 60 * 60 * 1000
    ).toISOString();
    console.log(e);
    await eventSubmit(entryText, date);
    alert("Event Sent!");
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
      fetchCurrentEvents();
    }
  }

  function handleChange(e) {
    setDateTime(e.target.value);
  }

  return (
    <>
      <div className="formOuterContainer">
        <div className="formContainer">
          <div className="EventEntryTitle">Event Entry</div>
          <button className="homeButton" onClick={handleClick}>
            <AiFillHome size={34} style={{ height: 40, width: 40 }} />
          </button>
          <form className="addEntry" onSubmit={handleSubmit}>
            <label className="addEvent">Event Description</label>
            <input
              className="addEventText"
              type="text"
              name=""
              id=""
              placeholder="Enter Event"
              onChange={(e) => setEntryText(e.target.value)}
              value={entryText}
              required
            />
            <DateSelecter />
            <input className="submitButton" type="submit" />
          </form>
        </div>
        <div className="eventsContainer">
          <form className="deleteEvents">
            <div className="deleteDiv">
              <div className="eventsContainerTextTitle">Current events</div>
              <button className="delete" onClick={handleDeleteClick}>
                <MdDelete size={34} style={{ height: 40, width: 40 }} />
              </button>
            </div>
            <div className="currentEvents">{eventsArray}</div>
          </form>
        </div>
      </div>
    </>
  );
}

export default InputForm;
