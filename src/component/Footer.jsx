import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">

        {/* Column 1: About / Description */}
        <div className="footer-column">
          <h4><i className="fas fa-hospital-symbol"></i> Laundry</h4>
          <p>
            We provide professional and timely laundry services to support hospitals and health facilities. 
            Cleanliness and hygiene are our top priorities to ensure patient safety and comfort.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/aboutus">About</a></li>
            <li><a href="/cause">Cause</a></li>
            <li><a href="/blood-donation-guidelines">Guidelines</a></li>
            <li><a href="/track-request">Track Record</a></li>
            <li><a href="/contactus">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Contact Information */}
        <div className="footer-column">
          <h4>Contact Us</h4>
          <p>📍 54826 Fadel Circles, Darrylstady</p>
          <p>📞 (+91) 8945623710 , (+91) 9632587410</p>
        </div>

        {/* Column 4: Social / Follow Us */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <p>Stay connected with us on social media for updates and news.</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://wa.me/918945623710" target="_blank" rel="noopener noreferrer" title="WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
