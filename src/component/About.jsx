import React from 'react';
import './About.css';
import blood1 from '../assets/blood1.png';
import blood2 from '../assets/blood2.png';

const About = () => {
  return (
    
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Us</h1>
      </section>

      {/* Intro Section */}
      <section className="about-intro">
        <h2>Committed to Saving Lives Through Blood Donation</h2>
        <p>
          We are a non-profit organization dedicated to ensuring safe, reliable, and accessible blood for every patient in need.
          Our mission is driven by compassion, community support, and a relentless pursuit to make a difference — one drop at a time.
        </p>
      </section>

      {/* Zigzag Section 1 */}
      <section className="about-section">
        <div className="about-row">
          <div className="about-card">
            <p>
              <strong>Why We Exist</strong><br />
              Every day, thousands of lives depend on the availability of safe blood. Unfortunately, many patients, especially in
              remote areas, still face shortages. Our platform connects generous donors with hospitals, creating a bridge of hope,
              health, and healing.
            </p>
          </div>
          <div className="about-image">
            <img src={blood2} alt="Why We Exist" />
          </div>
        </div>

        {/* Zigzag Section 2 */}
        <div className="about-row reverse">
          <div className="about-image">
            <img src={blood1} alt="What We Believe" />
          </div>
          <div className="about-card">
            <p>
              <strong>What We Believe</strong><br />
              We believe that donating blood is not just an act of kindness — it's an act of humanity. Through awareness drives,
              donation camps, and digital tools, we aim to inspire more people to step up and save lives with a simple,
              selfless act.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
