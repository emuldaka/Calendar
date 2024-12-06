import { useState } from "react";
import "./App.css";
import CalendarContextProvider from "./contexts/CalendarContext";
import Home from "./pages/Home";

function App() {
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);

  return (
    <>
      <CalendarContextProvider value={isFormDisplayed}>
        <Home />
      </CalendarContextProvider>
    </>
  );
}

export default App;
