import { useState, Component } from "react";
import "./App.css";
import { AuthProvider, useIsAuthenticated } from "react-auth-kit";
import CalendarContextProvider from "./contexts/CalendarContext";
import Home from "./pages/Home";
import Login from "./components/Login";

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
    <ErrorBoundary>
      <AuthProvider
        authType="cookie"
        authName="_auth"
        cookieDomain={
          process.env.NODE_ENV === "production"
            ? "calendar-8iqu.onrender.com"
            : "localhost"
        }
        cookieSecure={process.env.NODE_ENV === "production"}
      >
        <CalendarContextProvider value={isFormDisplayed}>
          <MainContent />
        </CalendarContextProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
