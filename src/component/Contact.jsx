import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">

      <div className="contact-container">
        {/* Left message block */}
        <div className="contact-message">
          <h2>Want to watch a miracle?<br />Go and donate blood.</h2>
           <p className="contact-subtext"> 👉Your one step can save someone's entire life.</p>
           <p> 👉Join us in making a real difference today.</p>
        </div>

        {/* Right form block */}
        <div className="contact-form">
          <h3>Contact Us</h3>
          <p>Fill up the form and our team will get back to you within 24 hours.</p>
          <form>
            <div className="form-row">
              <input type="text" placeholder="First Name *" required />
              <input type="text" placeholder="Last Name *" required />
            </div>
            <input type="email" placeholder="Email *" required />
            <input type="tel" placeholder="Phone *" required />
            <textarea placeholder="Message *" rows="4" required></textarea>
            <button type="submit">SUBMIT</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
