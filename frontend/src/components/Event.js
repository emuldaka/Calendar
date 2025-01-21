import React from "react";

function Event({ id, title, date, isChecked, handleCheckClick }) {
  let timeSlice = date.substring(11, 16);
  console.log(timeSlice);

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

  return (
    <>
      <div className="eventsArrayDiv">
        <textarea
          className="eventTitle"
          value={title}
          rows={title.length / 44} // Keep it as a single-line input (you can adjust as needed)
        />
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
