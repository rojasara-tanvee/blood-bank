import React from 'react';
import './DonateUs.css';
import qrImage from '../assets/qr.jpg'; // adjust path accordingly

const DonateUs = () => {
  return (
    <div className="donate-container">
      <div className="qr-section">
        <img src={qrImage} alt="Donate QR Code" />
      </div>
      <div className="info-section">
        <h2>Donate Us with UPI</h2>
        <p className="upi-number">UPI Mobile No. 9632587410</p>
        <p>
          Your support can help save lives. Every drop of blood counts and your donation helps us
          provide quick, safe, and reliable blood to those in need. Join us in this noble mission and
          contribute through the QR code or UPI details above.
        </p>
      </div>
    </div>
  );
};

export default DonateUs;
