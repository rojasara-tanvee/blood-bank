import React from 'react';
import { Link } from 'react-router-dom';
import BloodStorageChart from './BloodStorageChart';
import BloodPieChart from './BloodPieChart';
import UrgentNeeds from './UrgentNeeds';
import './Home.css';

const Home = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="overlay">
          <div className="cta-text">
            <h2>Donate Blood <span>Give the Gift of Life</span></h2>
          </div>

          <div className="action-buttons">
            {/* Request Blood - direct access */}
            <Link to="/request-blood">
              <div className="circle-btn">
                <div className="icon">🩸</div>
                <p>Request<br />Blood</p>
              </div>
            </Link>

            {/* Donate Blood - direct */}
            <Link to="/donate-blood">
              <div className="circle-btn">
                <div className="icon">👤</div>
                <p>Donate<br />Blood</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY DONATE SECTION */}
      <section className="why-donate-section">
        <h3 className="why-title">Why Should You Donate Blood?</h3>
        <div className="why-grid">
          <div className="why-box">
            <h4>🩸 Save Lives</h4>
            <p>Every 2 seconds, someone needs blood — from accident victims to cancer patients.</p>
            <p>Your donation can save up to 3 lives.</p>
          </div>
          <div className="why-box">
            <h4>🧬 No Substitute</h4>
            <p>Blood cannot be manufactured. It has to come from another human.</p>
            <p>That means voluntary donations are the only way to meet the demand.</p>
          </div>
          <div className="why-box">
            <h4>🔁 Donate Regularly</h4>
            <p>You can donate whole blood every 3 months and platelets/plasma more often.</p>
            <p>Regular donation keeps the blood supply flowing.</p>
          </div>
          <div className="why-box">
            <h4>🩺 Health Check</h4>
            <p>Before donation, you receive a mini health screening that checks your blood pressure, hemoglobin, and more.</p>
          </div>
          <div className="why-box">
            <h4>🫶 Community Help</h4>
            <p>Blood donation ensures hospitals are ready during emergencies, disasters, or shortages in your own area.</p>
            <p>By donating, you're ensuring your local hospitals are prepared.</p>
          </div>
          <div className="why-box">
            <h4>❤️ Human Kindness</h4>
            <p>It’s free, easy, and meaningful.</p>
            <p>Just 15 minutes of your time can give someone a second chance at life.</p>
          </div>
          <div className="why-box guidelines-box">
            <h4>📋 Donation Guidelines</h4>
            <p>Learn what to eat before and after donation, and which medical conditions prevent donation.</p>
            <Link to="/blood-donation-guidelines" className="guidelines-link">
              View Guidelines →
            </Link>
          </div>
        </div>
      </section>

      {/* BLOOD STORAGE CHART */}
      <BloodStorageChart />

      {/* BLOOD PIE CHART */}
      <BloodPieChart />

      {/* URGENT NEEDS */}
      <UrgentNeeds />


    </>
  );
};

export default Home;
