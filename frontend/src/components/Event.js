import React, { useRef, useEffect, useState } from "react";

function Event({ id, title, date, isChecked, handleCheckClick }) {
  const dateSlice = date.substring(0, 10);

  const timeSlice = date.substring(11, 16);

  return (
    <>
      <div className="eventsArrayDiv">
        <div>{title}</div>
        <div className="eventsArrayDivDates" id={id}>
          {dateSlice}
        </div>
        <div>{timeSlice}</div>
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
    </>
  );
}

export default Event;

// <h1 className="eventsTitle">Current events</h1>
// <div className="deleteButtonContainer">
//   <button className="delete" onClick={handleDeleteClick}>
//     <MdDelete size={34} style={{ height: 40, width: 40 }} />
//   </button>
// </div>
