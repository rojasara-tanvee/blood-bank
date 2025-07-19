import React, { useState } from 'react';
import './BloodBank.css';

const stateCityMap = {
  Gujarat: ['Ahmedabad', 'Surat', 'Rajkot', 'Vadodara'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
  Rajasthan: ['Jaipur', 'Jodhpur'],
  Delhi: ['New Delhi', 'Dwarka']
};

const BloodBank = () => {
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setCities(stateCityMap[state] || []);
    setSelectedCity('');
  };

  return (
    <div className="bloodbank-section">
      <div className="bloodbank-box">
        <h2>Find Blood banks of India</h2>

        <div className="search-container">
          <select value={selectedState} onChange={handleStateChange}>
            <option value="">Select state</option>
            {Object.keys(stateCityMap).map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <button className="search-btn">SEARCH</button>
        </div>
      </div>
    </div>
  );
};

export default BloodBank;
