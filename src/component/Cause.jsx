import React from 'react';
import './Cause.css';

const Cause = () => {
  return (
    <div className="cause-container">
      <div className="cause-card">
       <img
          className="cause-image"
          src="../src/assets/blood2.png" // Use your local image here
          alt="Blood Donation"
        />
        <div className="cause-content">
          <h2>Wipe out Blood Shortage</h2>
          <p>
           “We are committed to solving the problem of blood shortage. 
           Many people are in urgent need of blood, and by donating, you can truly make a difference. 
           Your support helps us reach those in need quickly and safely.
            Together, we can save lives and bring hope to those in critical situations.”
          </p>


        </div>
      </div>
    </div>
  );
};

export default Cause;
