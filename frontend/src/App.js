import { useContext, useState } from "react";
import "./App.css";
import InputForm from "./components/InputForm";
import CalendarContextProvider from "./contexts/CalendarContext";
import { CalendarContext } from "./contexts/CalendarContext";
import Home from "./pages/Home";

function App() {
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  console.log(isFormDisplayed);

  if (isFormDisplayed) {
    console.log("isFormDisplayed is true");
    console.log(isFormDisplayed);
  }

  return (
    <>
      <CalendarContextProvider value={isFormDisplayed}>
        <Home />
      </CalendarContextProvider>
    </>
  );
}

export default App;
