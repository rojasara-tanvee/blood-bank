import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      {/* Left: Logo */}
      <div className="logo">🩸 <span>Blood Donation</span></div>

      {/* Center: Navigation */}
      <nav className="nav-links">
        <Link to="/">HOME</Link>
        <Link to="/cause">CAUSE</Link>
        <Link to="/aboutus">ABOUT US</Link>
        <Link to="/blood-donation-guidelines">GUIDELINES</Link>
        <Link to="/contactus">CONTACT US</Link>
        <Link to="/track-request">TRACK REQUEST</Link>
      </nav>

      {/* Right: Buttons */}
      <div className="header-buttons">
        <Link to="/login">
          <button className="login-btn">LOGIN</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
