import { useCallback } from "react";

export const useEventSubmit = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const eventSubmit = useCallback(
    async (title, date, authHeader) => {
      try {
        const response = await fetch(`${apiUrl}/api/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({ title, date }),
        });
        const json = await response.json();
        if (!response.ok) {
          console.log(json.error);
        }
        if (response.ok) {
          return true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [apiUrl]
  );

  return { eventSubmit };
};
