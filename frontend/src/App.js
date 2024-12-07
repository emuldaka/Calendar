import { useEffect, useState } from "react";
import "./App.css";
import CalendarContextProvider from "./contexts/CalendarContext";
import Home from "./pages/Home";

function App() {
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:5000/api")
  //     .then((response) => response.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  return (
    <>
      <CalendarContextProvider value={isFormDisplayed}>
        <Home />
      </CalendarContextProvider>
    </>
  );
}

export default App;
