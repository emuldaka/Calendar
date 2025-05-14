import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useContext } from "react";
import { useSignOut, useAuthUser, useAuthHeader } from "react-auth-kit";
import "../App.css";
import InputForm from "../components/InputForm";
import { CalendarContext } from "../contexts/CalendarContext";
import { useCurrentMonth } from "../hooks/useCurrentMonth";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import determineEmptyCells from "../util/determineEmptyCells";
import { MdOutlineArrowCircleLeft } from "react-icons/md";

function Home() {
  const {
    isFormDisplayed,
    setIsFormDisplayed,
    setCurrentTime,
    setCellDay,
    monthPagination,
    setMonthPagination,
    yearPagination,
    setYearPagination,
    currentCellDate,
    setCurrentCellDate,
    // dateTime,
    // setDateTime,
  } = useContext(CalendarContext);
  const signOut = useSignOut();
  const authUser = useAuthUser();
  const authHeader = useAuthHeader();
  const [monthDays, setMonthDays] = useState([
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ]);
  const [monthlyFetch, setMonthlyFetch] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const fetchTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const hasFetchedRef = useRef(false);
  const authHeaderValue = useMemo(() => authHeader(), [authHeader]);

  const isAuthenticated = !!authUser();

  useEffect(() => {
    const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setCurrentTime(now);
  }, [setCurrentTime]);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      const monthsOrdered = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      setCellDay(e.target.id);
      setIsFormDisplayed(true);
      const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setCurrentTime(now);
      setCurrentCellDate(
        `${monthsOrdered[monthPagination - 1]} ${e.target.id} ${yearPagination}`
      );
    },
    [
      monthPagination,
      setCellDay,
      setCurrentTime,
      setIsFormDisplayed,
      yearPagination,
      setCurrentCellDate,
    ]
  );

  const fetchCurrentEvents = useCallback(async () => {
    if (isFetching || !isAuthenticated) return;
    setIsFetching(true);

    const month =
      monthPagination < 10 ? `0${monthPagination}` : monthPagination;
    const maxRetries = 3;

    try {
      const response = await fetch(
        `${apiUrl}/api/events/month/${yearPagination}-${month}`,
        {
          headers: {
            Authorization: authHeaderValue,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      const arr = json.map((event) => event.date.substring(8, 10));
      setMonthlyFetch(arr);
      retryCountRef.current = 0;
    } catch (error) {
      console.error("Error fetching events:", error, {
        status: error.response?.status,
        headers: authHeaderValue,
      });
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        fetchTimeoutRef.current = setTimeout(() => fetchCurrentEvents(), 5000);
      } else {
        console.error("Max retries reached, stopping fetch attempts.");
      }
    } finally {
      setIsFetching(false);
    }
  }, [
    monthPagination,
    yearPagination,
    apiUrl,
    authHeaderValue,
    isAuthenticated,
  ]);

  // Debug fetchCurrentEvents recreation
  const fetchCurrentEventsRef = useRef(fetchCurrentEvents);
  useEffect(() => {
    if (fetchCurrentEventsRef.current !== fetchCurrentEvents) {
      console.log("fetchCurrentEvents recreated");
      fetchCurrentEventsRef.current = fetchCurrentEvents;
    }
  }, [fetchCurrentEvents]);

  // Reset retry count and hasFetched on pagination change
  useEffect(() => {
    retryCountRef.current = 0;
    hasFetchedRef.current = false;
  }, [monthPagination, yearPagination]);

  useEffect(() => {
    console.log("useEffect triggered", {
      monthPagination,
      yearPagination,
      isFormDisplayed,
      isAuthenticated,
    });
    if (!isFormDisplayed && isAuthenticated && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchCurrentEvents();
    }
    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, [
    monthPagination,
    yearPagination,
    isFormDisplayed,
    fetchCurrentEvents,
    isAuthenticated,
  ]);

  const emptyCells = useCallback(() => {
    function doubleDigitFormatting(number) {
      return number < 10 ? `0${number}` : number.toString();
    }

    let arr = [];
    let emptyCellsCount = determineEmptyCells(yearPagination, monthPagination);
    let emptyCellsTotal = emptyCellsCount - 2;

    if (emptyCellsTotal === -1) emptyCellsTotal = 6;
    else if (emptyCellsTotal === -2) emptyCellsTotal = 5;

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const formattedDate = today.toISOString().split("T")[0];

    for (let j = 0; j < emptyCellsTotal; j++) {
      arr.push(
        <div className="cell" key={j}>
          <div className="cellTextContainer">
            <div className="cellText"></div>
          </div>
        </div>
      );
    }

    for (let i = 1; i <= monthDays[monthPagination - 1]; i++) {
      const day = doubleDigitFormatting(i);
      const count = monthlyFetch.filter((element) => element === day).length;
      const result =
        count === 1 ? "1 Event" : count > 0 ? `${count} Events` : "";

      arr.push(
        <div className="cell" key={day}>
          <div className="cellTextContainer">
            {formattedDate ===
            `${yearPagination}-${doubleDigitFormatting(
              monthPagination
            )}-${day}` ? (
              <div
                className="cellText"
                style={{
                  color: "white",
                  textShadow:
                    "1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                }}
              >
                {day}
              </div>
            ) : (
              <div className="cellText">{day}</div>
            )}
            {formattedDate ===
            `${yearPagination}-${doubleDigitFormatting(
              monthPagination
            )}-${day}` ? (
              <div className="today">TODAY</div>
            ) : (
              <div></div>
            )}
            <div className="resultDiv">{result}</div>
            <button className="editButton" onClick={handleClick} id={day}>
              View/Edit
            </button>
          </div>
        </div>
      );
    }
    return arr;
  }, [handleClick, monthDays, monthPagination, monthlyFetch, yearPagination]);

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const leftPagination = debounce(() => {
    if (monthPagination === 1) {
      setMonthDays(
        isLeapYear(yearPagination - 1)
          ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
          : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      );
      setMonthPagination(12);
      setYearPagination(yearPagination - 1);
    } else {
      setMonthPagination(monthPagination - 1);
    }
  }, 300);

  const rightPagination = debounce(() => {
    if (monthPagination === 12) {
      setMonthDays(
        isLeapYear(yearPagination + 1)
          ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
          : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      );
      setMonthPagination(1);
      setYearPagination(yearPagination + 1);
    } else {
      setMonthPagination(monthPagination + 1);
    }
  }, 300);

  const currentMonthYearDisplay = `${useCurrentMonth(
    monthPagination
  )} ${yearPagination}`;

  function handleReturnClick() {
    setIsFormDisplayed(false);
  }

  function handleLogout() {
    signOut();
  }

  return (
    <>
      {isFormDisplayed ? (
        <div className="currentMonthCon2">
          <button className="backButton" onClick={handleReturnClick}>
            <MdOutlineArrowCircleLeft size={50} />
          </button>
          <div className="theDate">
            {currentCellDate} - Selected Day's Events - Central Time (CDT)
          </div>
        </div>
      ) : (
        <div className="header-container">
          <span className="welcome-message">
            Welcome, {authUser()?.email || "User"}!
          </span>
          <div className="currentMonthCon">
            <button className="pageLeft" onClick={leftPagination}>
              <IoIosArrowBack size={20} />
            </button>
            <h2 className="currentMonth">{currentMonthYearDisplay}</h2>
            <button className="pageRight" onClick={rightPagination}>
              <IoIosArrowForward size={20} />
            </button>
            <button
              className="auth-submit-button logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {isFormDisplayed ? (
        <InputForm />
      ) : (
        <>
          <div className="days">
            <div className="dayNames" key="Monday">
              Monday
            </div>
            <div className="dayNames" key="Tuesday">
              Tuesday
            </div>
            <div className="dayNames" key="Wednesday">
              Wednesday
            </div>
            <div className="dayNames" key="Thursday">
              Thursday
            </div>
            <div className="dayNames" key="Friday">
              Friday
            </div>
            <div className="dayNames" key="Saturday">
              Saturday
            </div>
            <div className="dayNames" key="Sunday">
              Sunday
            </div>
          </div>
          <div className="grid-container">{emptyCells()}</div>
        </>
      )}
    </>
  );
}

export default Home;
