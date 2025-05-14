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
  } = useContext(CalendarContext);
  const signOut = useSignOut();
  const authUser = useAuthUser();
  const authHeaderHook = useAuthHeader(); // Get the hook function
  const [monthDays, setMonthDays] = useState([
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ]);
  const [monthlyFetch, setMonthlyFetch] = useState([]);
  const isFetchingRef = useRef(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const isAuthenticated = !!authUser();

  // Memoize the authHeader value to prevent recreation on every render
  const authHeader = useMemo(() => authHeaderHook(), [authHeaderHook]);

  // Set current time once on mount
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

  // Memoized fetch function
  const fetchCurrentEvents = useCallback(async () => {
    if (isFetchingRef.current || !isAuthenticated) return;
    isFetchingRef.current = true;
    console.log("Fetching events in Home.js");

    const month =
      monthPagination < 10 ? `0${monthPagination}` : monthPagination;
    try {
      const response = await fetch(
        `${apiUrl}/api/events/month/${yearPagination}-${month}`,
        {
          headers: { Authorization: authHeader },
          credentials: "include", // Ensure cookies are sent
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      setMonthlyFetch(json.map((event) => event.date.substring(8, 10)));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      isFetchingRef.current = false;
    }
  }, [monthPagination, yearPagination, apiUrl, authHeader, isAuthenticated]);

  // Effect to fetch events when month/year changes
  useEffect(() => {
    console.log("Home.js useEffect triggered");
    if (!isFormDisplayed && isAuthenticated) {
      fetchCurrentEvents();
    }
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

  useEffect(() => {
    emptyCells();
  }, [emptyCells, isFormDisplayed]);

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function leftPagination() {
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
  }

  function rightPagination() {
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
  }

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
            {currentCellDate} - Selected Day's Events
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
