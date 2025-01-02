async function fetchCurrentEvents() {
  const response = await fetch(
    `http://localhost:5000/api/events/${cellYear}-${cellMonth}-${cellDay}`
  );
  const json = await response.json();
  if (response.ok) {
    setCurrentEvents(json);
  }
}

export { fetchCurrentEvents };
