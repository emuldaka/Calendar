import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { AiFillHome } from "react-icons/ai";
import { useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";
import { useEventSubmit } from "../hooks/useEventSubmit";
import Event from "./Event";
import { MdDelete } from "react-icons/md";
import { DateSelecter } from "./DateSelecter";

function InputForm() {
  const [entryText, setEntryText] = useState("");
  const { eventSubmit } = useEventSubmit();
  const authHeader = useAuthHeader();
  const authUser = useAuthUser();
  const [checkedEvents, setCheckedEvents] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const {
    isFormDisplayed,
    setIsFormDisplayed,
    cellDay,
    monthPagination,
    yearPagination,
    dateTime,
    currentEvents,
    setCurrentEvents,
    forceRerender,
  } = useContext(CalendarContext);
  const [eventsArray, setEventsArray] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const fetchTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const hasFetchedRef = useRef(false);
  const authHeaderValue = useMemo(() => authHeader(), [authHeader]);

  const isAuthenticated = !!authUser();

  const fetchCurrentEvents = useCallback(async () => {
    if (isFetching || !isAuthenticated) return;
    setIsFetching(true);

    const month =
      monthPagination < 10 ? `0${monthPagination}` : monthPagination;
    const day = Number(cellDay) < 10 ? `0${Number(cellDay)}` : cellDay;
    const fetchDate = `${yearPagination}-${month}-${day}`;

    console.log("Fetching events for:", fetchDate, {
      authHeader: authHeaderValue,
      url: `${apiUrl}/api/events/${fetchDate}`,
    });

    try {
      const response = await fetch(`${apiUrl}/api/events/${fetchDate}`, {
        headers: {
          Authorization: authHeaderValue,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, details: ${JSON.stringify(
            errorData
          )}`
        );
      }
      const json = await response.json();
      // Convert date fields to ISO strings
      const normalizedEvents = json.map((event) => ({
        ...event,
        date: new Date(event.date).toISOString(),
      }));
      console.log("Fetched events (normalized):", normalizedEvents);
      setCurrentEvents(normalizedEvents);
      retryCountRef.current = 0;
    } catch (error) {
      console.error("Error fetching events:", error, {
        status: error.response?.status,
        headers: authHeaderValue,
      });
      if (retryCountRef.current < 3) {
        retryCountRef.current += 1;
        fetchTimeoutRef.current = setTimeout(() => fetchCurrentEvents(), 5000);
      } else {
        console.error("Max retries reached, stopping fetch attempts.");
      }
    } finally {
      setIsFetching(false);
    }
  }, [
    setCurrentEvents,
    yearPagination,
    monthPagination,
    cellDay,
    apiUrl,
    authHeaderValue,
    isAuthenticated,
  ]);

  const fetchCurrentEventsRef = useRef(fetchCurrentEvents);
  useEffect(() => {
    if (fetchCurrentEventsRef.current !== fetchCurrentEvents) {
      console.log("fetchCurrentEvents recreated in InputForm");
      fetchCurrentEventsRef.current = fetchCurrentEvents;
    }
  }, [fetchCurrentEvents, forceRerender]);

  useEffect(() => {
    retryCountRef.current = 0;
    hasFetchedRef.current = false;
    console.log("Date changed in InputForm", {
      yearPagination,
      monthPagination,
      cellDay,
      dateTime,
      dateTimeISO: dateTime ? new Date(dateTime).toISOString() : "null",
    });
  }, [yearPagination, monthPagination, cellDay, dateTime]);

  useEffect(() => {
    console.log("useEffect triggered in InputForm", {
      isFormDisplayed,
      isAuthenticated,
      forceRerender,
    });
    if (isFormDisplayed && isAuthenticated) {
      // hasFetchedRef.current = true;
      fetchCurrentEvents();
    }
    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, [fetchCurrentEvents, forceRerender, isFormDisplayed, isAuthenticated]);

  function handleClick() {
    setIsFormDisplayed(false);
  }

  const eventsArrayPopulator = useCallback(() => {
    console.log(
      "Running eventsArrayPopulator with currentEvents:",
      currentEvents
    );
    const sortedEvents = [...currentEvents].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    const localEventsArray = sortedEvents.map((event) => (
      <Event
        key={event._id}
        id={event._id}
        title={event.title}
        date={event.date} // Now ISO string
        isChecked={checkedEvents[event._id] || false}
        handleCheckClick={(id, isChecked) => handleCheckClick(id, isChecked)}
      />
    ));

    setEventsArray(localEventsArray);
  }, [currentEvents, checkedEvents]);

  useEffect(() => {
    console.log("eventsArrayPopulator useEffect triggered in InputForm", {
      isFormDisplayed,
    });
    if (isFormDisplayed) {
      eventsArrayPopulator();
    }
  }, [eventsArrayPopulator, isFormDisplayed, currentEvents]);

  function handleCheckClick(id, isChecked) {
    setCheckedEvents((prev) => {
      console.log("Updating checkedEvents:", { id, isChecked });
      return {
        ...prev,
        [id]: isChecked,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const adjustedDate = new Date(dateTime);
    if (isNaN(adjustedDate.getTime())) {
      console.error("Invalid dateTime in handleSubmit:", dateTime);
      return;
    }
    const isoDate = adjustedDate.toISOString();

    console.log("Submitting event:", {
      title: entryText,
      date: isoDate,
      dateTimeRaw: dateTime,
      cellDay,
      monthPagination,
      yearPagination,
      authHeader: authHeaderValue,
    });

    try {
      const response = await eventSubmit(entryText, isoDate, authHeaderValue);
      console.log("Event submitted successfully, response:", response);
      setEntryText("");
      hasFetchedRef.current = false;
      fetchCurrentEvents();
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  }

  async function handleDeleteClick(e) {
    e.preventDefault();
    const idArray = Object.keys(checkedEvents).filter(
      (id) => checkedEvents[id]
    );

    console.log("Deleting events:", idArray);
    try {
      const response = await fetch(`${apiUrl}/api/events`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeaderValue,
        },
        body: JSON.stringify({ data: idArray }),
      });
      if (response.ok) {
        console.log("Events deleted successfully");
        hasFetchedRef.current = false;
        fetchCurrentEvents();
      } else {
        console.error("Error deleting events:", await response.json());
      }
    } catch (error) {
      console.error("Error in delete request:", error);
    }
  }

  return (
    <>
      <div className="formOuterContainer">
        <div className="formContainer">
          <div className="EventEntryTitle">Event Entry</div>
          <button className="homeButton" onClick={handleClick}>
            <AiFillHome size={34} style={{ height: 40, width: 40 }} />
          </button>
          <form className="addEntry" onSubmit={handleSubmit}>
            <label className="addEvent">Event Description</label>
            <input
              className="addEventText"
              type="text"
              maxLength="120"
              placeholder="Enter Event"
              onChange={(e) => setEntryText(e.target.value)}
              value={entryText}
              required
            />
            <DateSelecter />
            <input className="submitButton" type="submit" />
          </form>
        </div>
        <div className="eventsContainer">
          <form className="deleteEvents">
            <div className="deleteDiv">
              <div className="eventsContainerTextTitle">
                Double Click Events Below To Edit
              </div>
              <button className="delete" onClick={handleDeleteClick}>
                <MdDelete size={34} style={{ height: 40, width: 40 }} />
              </button>
            </div>
            <div className="currentEvents">{eventsArray}</div>
          </form>
        </div>
      </div>
    </>
  );
}

export default InputForm;
