import { useState, Component } from "react";
import "./App.css";
import { AuthProvider, useIsAuthenticated } from "react-auth-kit";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarContextProvider from "./contexts/CalendarContext";
import Home from "./pages/Home";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page or logging in again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainContent() {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated() ? <Home /> : <Login />;
}

function App() {
  const [isFormDisplayed] = useState(false);

  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider
          authType="cookie"
          authName="_auth"
          cookieDomain={
            process.env.NODE_ENV === "production"
              ? "emuldaka.site"
              : "localhost"
          }
          cookiePath="/"
          cookieSecure={process.env.NODE_ENV === "production"}
          cookieSameSite={process.env.NODE_ENV === "production" ? "Lax" : "Lax"}
        >
          <CalendarContextProvider value={isFormDisplayed}>
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </CalendarContextProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
