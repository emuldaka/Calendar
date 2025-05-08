import React, { useState } from "react";
import { useSignIn } from "react-auth-kit";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useSignIn();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const endpoint = isRegister ? "register" : "login";
    try {
      const response = await fetch(`${apiUrl}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }
      signIn({
        token: data.token,
        expiresIn: 60,
        tokenType: "Bearer",
        authState: { email },
      });
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isRegister ? "Register" : "Login"}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <label className="auth-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="auth-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
            disabled={isLoading}
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button
          type="submit"
          className="auth-submit-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : isRegister ? (
            "Register"
          ) : (
            "Login"
          )}
        </button>
      </form>
      <button
        className="auth-switch-button"
        onClick={() => setIsRegister(!isRegister)}
        disabled={isLoading}
      >
        {isRegister ? "Switch to Login" : "Switch to Register"}
      </button>
    </div>
  );
}

export default Login;
