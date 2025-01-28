import { useState } from "react";

export const useEventSubmit = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const eventSubmit = async (title, date) => {
    setIsLoading(true);
    setError(null);

    const localDate = new Date(date); // `date` is in UTC
    const localDateString = localDate.toISOString().slice(0, 16);

    const response = await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date: localDateString }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      setIsLoading(false);
      alert("Event Sent!");
    }
  };
  return { eventSubmit, isLoading, error };
};
