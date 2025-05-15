import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  // Get token from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  // Regex for password validation (same as in Login.js)
  const passwordRegex = /^.{6,12}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate password
    if (!passwordRegex.test(newPassword)) {
      setError("Password must be between 6 and 12 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }
      setMessage(
        "Password reset successful! Please log in with your new password."
      );
      setTimeout(() => navigate("/"), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Reset Password</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <label className="auth-label">New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="auth-input"
            disabled={isLoading}
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-message">{message}</p>}
        <button
          type="submit"
          className="auth-submit-button"
          disabled={isLoading}
        >
          {isLoading ? <span className="spinner"></span> : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
