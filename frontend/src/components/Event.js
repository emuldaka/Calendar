import React, { useRef, useEffect, useState } from "react";

function Event({ id, title, date }) {
  const [isChecked, setIsChecked] = useState(false);

  function deleteSubmit(e) {
    e.preventDefault();
    setIsChecked(e.target.checked);
    console.log(e.target.checked);
  }

  const dateSlice = date.substring(0, 10);

  const timeSlice = date.substring(11, 16);

  return (
    <>
      <div className="eventsArrayDiv">
        <div>{title}</div>
        <div className="eventsArrayDivDates">{dateSlice}</div>
        <div>{timeSlice}</div>
        <input
          className="checkbox-container"
          type="checkbox"
          checked={isChecked}
          size={24}
          value={title}
          onChange={deleteSubmit}
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
