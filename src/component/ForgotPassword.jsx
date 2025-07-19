import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"; // ✅ Separate CSS

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (email) {
      const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpValue);
      setOtpSent(true);
      setError("");
      setMessage("Sending OTP...");

      fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      })
        .then((res) => res.json())
        .then((data) => setMessage(data.message || "OTP sent successfully!"))
        .catch(() => {
          setError("Failed to send OTP email.");
          setMessage("");
        });
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      setVerified(true);
      setError("");
      setMessage("OTP verified successfully.");
    } else {
      setError("Invalid OTP. Please try again.");
      setMessage("");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
    } else {
      setError("");
      setMessage("Password reset successful!");

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>

        {!otpSent && (
          <form onSubmit={handleSendOtp}>
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send OTP</button>
          </form>
        )}

        {otpSent && !verified && (
          <form onSubmit={handleVerifyOtp}>
            <label>Enter OTP sent to your email</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Verify OTP</button>
          </form>
        )}

        {verified && (
          <form onSubmit={handleResetPassword}>
            <label>New Password</label>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit">Reset Password</button>
          </form>
        )}

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
