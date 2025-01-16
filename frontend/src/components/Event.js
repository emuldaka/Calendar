import React from "react";

function Event({ id, title, date, isChecked, handleCheckClick }) {
  const timeSlice = date.substring(11, 16);

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
          <span className="timeSlice">{timeSlice}</span>
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
