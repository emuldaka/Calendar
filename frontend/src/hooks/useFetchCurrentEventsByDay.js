import { useState } from "react";

export const useFetchCurrentEventsByDay = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const fetchCurrentEventsByDay = async (year, month, day) => {
    setIsLoading(true);
    setError(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    const response = await fetch(
      `${apiUrl}/api/events/${year}-${month < 10 ? "0" + month : month}-${day}`
    );
    const json = await response.json();
    if (response.ok) {
      setIsLoading(false);
      return json;
    }
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
  };
  return { fetchCurrentEventsByDay, isLoading, error };
};
