import React, { useState } from "react";

function Event({ id, title, date, isChecked, handleCheckClick }) {
  const [text, setText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  let timeSlice = date.substring(11, 16);

  function PmConverter(time) {
    const [hours, minutes] = time.split(":").map(Number);

    let minuteConversion = hours * 60 + minutes - 720;

    const resultHours = Math.floor(minuteConversion / 60);

    const resultMinutes = minuteConversion % 60;

    const formattedTime = `${resultHours
      .toString()
      .padStart(2, "0")}:${resultMinutes.toString().padStart(2, "0")}`;

    return formattedTime + " PM";
  }

  if (timeSlice < "01:00") {
    timeSlice = timeSlice.substring(3);
    timeSlice = `12:${timeSlice}`;
  }

  const handleChange = () => {
    setIsDisabled(!isDisabled);
    console.log(isDisabled);
    // setText(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, title: text }),
    });
    const json = await response.json();

    if (!response.ok) {
      console.log(json.error);
    }
    if (response.ok) {
      alert("Event Updated!");
      console.log(id, text);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    console.log("Cancel Edit");
    setText(title);
    setIsDisabled(!isDisabled);
  };

  return (
    <>
      <div className="eventsArrayDiv">
        {isDisabled === true ? (
          <textarea
            className="eventTitle"
            value={title}
            rows={title.length / 44} // Keep it as a single-line input (you can adjust as needed)
            onClick={handleChange}
          />
        ) : (
          <>
            <input
              className="eventTitle"
              value={text === "" ? title : text}
              rows={title.length / 44}
              // onClick={handleChange}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="editFormButtons">
              <button onClick={handleSubmit}>Submit Change</button>
              <button onClick={handleCancel}>Cancel Edit</button>
            </div>
          </>
        )}

        <div className="eventsArrayDivDates" id={id}></div>

        <div className="eventTime">
          <span className="timeSlice">
            {timeSlice < "13:00" ? timeSlice + " AM" : PmConverter(timeSlice)}
          </span>
          <input
            className="checkbox-container"
            type="checkbox"
            checked={isChecked}
            size={24}
            value={title}
            onChange={(e) => handleCheckClick(id, e.target.checked)}
            style={{
              height: 20,
              width: 20,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Event;
