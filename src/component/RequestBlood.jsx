import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DonateBlood.css"; // ✅ Use the existing DonateBlood.css
import EmergencyAlert from "./EmergencyAlert";

// Default hospitals organized by state and city
const defaultHospitalsByState = {
  Gujarat: {
    Surat: ["New Life Hospital", "Apollo", "City Care"],
    Ahmedabad: ["Zydus", "Civil Hospital"]
  },
  Maharashtra: {
    Mumbai: ["Tata Memorial", "Kokilaben"],
    Pune: ["Ruby Hall", "Sahyadri Hospital"]
  }
};

const RequestBlood = () => {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [showHospitals, setShowHospitals] = useState(false);
  const [allHospitals, setAllHospitals] = useState({});
  const [availableStates, setAvailableStates] = useState(['Gujarat', 'Maharashtra']); // Default states
  const [availableCities, setAvailableCities] = useState([]);
  const navigate = useNavigate();

  // Load hospitals from admin panel and organize by state-city
  useEffect(() => {
    console.log('=== LOADING HOSPITALS (RequestBlood) ===');
    console.log('Default hospitals structure:', defaultHospitalsByState);

    const savedHospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
    console.log('Saved hospitals from localStorage:', savedHospitals);

    // Start with default hospitals organized by state
    const hospitalsByState = JSON.parse(JSON.stringify(defaultHospitalsByState)); // Deep copy
    console.log('Initial hospitalsByState after deep copy:', hospitalsByState);

    // Add hospitals from admin panel to their respective states and cities
    savedHospitals.forEach(hospital => {
      const stateName = hospital.state || 'Other';
      const cityName = hospital.city || 'Other';

      console.log(`Processing hospital: ${hospital.name}, State: ${stateName}, City: ${cityName}`);

      // Initialize state if it doesn't exist
      if (!hospitalsByState[stateName]) {
        hospitalsByState[stateName] = {};
        console.log(`Created new state: ${stateName}`);
      }

      // Initialize city if it doesn't exist
      if (!hospitalsByState[stateName][cityName]) {
        hospitalsByState[stateName][cityName] = [];
        console.log(`Created new city: ${cityName} in state: ${stateName}`);
      }

      // Add hospital name (without state since it's already organized by state)
      hospitalsByState[stateName][cityName].push(hospital.name);
      console.log(`Added hospital: ${hospital.name} to ${stateName} -> ${cityName}`);
    });

    // Get all available states
    const states = Object.keys(hospitalsByState);
    console.log('Available states:', states); // Debug log
    console.log('States length:', states.length);
    setAvailableStates(states);

    // Set the hospital data
    setAllHospitals(hospitalsByState);
    console.log('Final hospital structure:', hospitalsByState); // Debug log
    console.log('=== END LOADING (RequestBlood) ===');
  }, []);

  // Update available cities when state changes
  const handleStateChange = (selectedState) => {
    setState(selectedState);
    setCity(""); // Reset city when state changes
    setShowHospitals(false); // Hide hospitals when state changes

    // Update available cities for the selected state
    if (selectedState && allHospitals[selectedState]) {
      const cities = Object.keys(allHospitals[selectedState]);
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  };

  const handleFindBlood = () => {
    if (city && state) {
      setShowHospitals(true);
    }
  };

  const handleHospitalClick = (hospitalName) => {
    navigate(`/hospital-form/${encodeURIComponent(hospitalName)}`);
  };

  return (
    <>
      <EmergencyAlert />
      <div className="donate-blood-page">
        <h2>Find Blood</h2>

        <div className="content-container">
          <div className="search-section">
            <select value={state} onChange={(e) => handleStateChange(e.target.value)}>
              <option value="">--Select State--</option>
              {console.log('Rendering states:', availableStates)}
              {availableStates.map(stateName => (
                <option key={stateName} value={stateName}>{stateName}</option>
              ))}
            </select>

            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">--Select City--</option>
              {availableCities.map(cityName => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>

            <button className="search-btn" onClick={handleFindBlood}>
              FIND BLOOD
            </button>
          </div>

          {showHospitals && (
            <>
              <h3>Hospitals in {city}, {state}</h3>
              {allHospitals[state] && allHospitals[state][city] && allHospitals[state][city].length > 0 ? (
                <ul className="hospital-list">
                  {allHospitals[state][city].map((hospital) => (
                    <li key={hospital} onClick={() => handleHospitalClick(hospital)}>
                      {hospital}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-hospitals">
                  <p>No hospitals found in {city}, {state}. Please try another city or contact admin to add hospitals.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RequestBlood;
