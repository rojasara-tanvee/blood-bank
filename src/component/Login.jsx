// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      // Check for admin credentials
      if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("userEmail", email);
        setError("");
        navigate("/admin");
        return;
      }

      // Regular user login
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("isAdmin", "false");
      localStorage.setItem("userEmail", email);
      setError("");
      navigate("/");
    } else {
      setError("Please enter both email and password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">🔒</div>
        <h2>Sign in</h2>

        <form onSubmit={handleLogin}>
          <label>Email Address *</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password *</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-options">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit">SIGN IN</button>

          {error && <p className="login-error">{error}</p>}

          <div className="login-links">
            <Link to="/forgot-password">Forgot password</Link>
            <Link to="/signup"><strong>Sign Up</strong></Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
