function stuff() {
  return isDisplayed === true ? (
    <textarea
      className="eventTitle"
      value={title + "  **Click here to edit**  "}
      rows={title.length / 44} // Keep it as a single-line input (you can adjust as needed)
    />
  ) : (
    <input className="eventTitle" value={title} rows={title.length / 44} />
  );
}
