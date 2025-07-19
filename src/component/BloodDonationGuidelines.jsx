import React from 'react';
import { Link } from 'react-router-dom';
import './BloodDonationGuidelines.css';

const BloodDonationGuidelines = () => {
  const beforeDonationFoods = [
    { name: "Iron-Rich Foods", items: ["Spinach", "Red meat", "Lentils", "Tofu", "Quinoa"], icon: "🥬" },
    { name: "Vitamin C Foods", items: ["Oranges", "Strawberries", "Bell peppers", "Broccoli", "Tomatoes"], icon: "🍊" },
    { name: "Hydrating Foods", items: ["Watermelon", "Cucumber", "Coconut water", "Soups", "Herbal teas"], icon: "💧" },
    { name: "Complex Carbs", items: ["Oatmeal", "Brown rice", "Whole wheat bread", "Sweet potatoes"], icon: "🍞" },
    { name: "Protein Sources", items: ["Eggs", "Fish", "Chicken", "Beans", "Nuts"], icon: "🥚" }
  ];

  const afterDonationFoods = [
    { name: "Recovery Foods", items: ["Banana", "Orange juice", "Crackers", "Cookies", "Energy bars"], icon: "🍌" },
    { name: "Hydration", items: ["Water", "Sports drinks", "Fruit juices", "Coconut water"], icon: "🥤" },
    { name: "Iron Replenishment", items: ["Dark leafy greens", "Red meat", "Liver", "Dried fruits"], icon: "🥩" },
    { name: "Vitamin B12", items: ["Fish", "Dairy products", "Fortified cereals", "Nutritional yeast"], icon: "🐟" },
    { name: "Folate Sources", items: ["Asparagus", "Avocado", "Brussels sprouts", "Fortified grains"], icon: "🥑" }
  ];

  const disqualifyingDiseases = [
    {
      category: "Blood-Borne Diseases",
      diseases: ["HIV/AIDS", "Hepatitis B", "Hepatitis C", "Syphilis", "HTLV"],
      icon: "🩸",
      reason: "Risk of transmission through blood"
    },
    {
      category: "Heart Conditions",
      diseases: ["Heart disease", "Heart attack history", "Severe arrhythmia", "Heart surgery"],
      icon: "❤️",
      reason: "Donation may strain cardiovascular system"
    },
    {
      category: "Cancer",
      diseases: ["Active cancer", "Blood cancers", "Recent cancer treatment", "Chemotherapy"],
      icon: "🎗️",
      reason: "Compromised immune system and treatment effects"
    },
    {
      category: "Autoimmune Disorders",
      diseases: ["Lupus", "Rheumatoid arthritis", "Multiple sclerosis", "Crohn's disease"],
      icon: "🛡️",
      reason: "Immune system complications"
    },
    {
      category: "Blood Disorders",
      diseases: ["Hemophilia", "Sickle cell disease", "Thalassemia", "Severe anemia"],
      icon: "🔴",
      reason: "Blood composition and clotting issues"
    },
    {
      category: "Infectious Diseases",
      diseases: ["Tuberculosis", "Malaria", "Chagas disease", "Babesiosis"],
      icon: "🦠",
      reason: "Risk of infection transmission"
    }
  ];

  const generalTips = [
    { tip: "Drink plenty of water 24-48 hours before donation", icon: "💧" },
    { tip: "Get a good night's sleep before donating", icon: "😴" },
    { tip: "Eat a healthy meal 3 hours before donation", icon: "🍽️" },
    { tip: "Avoid alcohol 24 hours before and after donation", icon: "🚫" },
    { tip: "Rest for 15-20 minutes after donation", icon: "🛋️" },
    { tip: "Keep the bandage on for 4-6 hours", icon: "🩹" }
  ];

  return (
    <div className="guidelines-page">
      <div className="guidelines-header">
        <div className="header-content">
          <h1>🩸 Blood Donation Guidelines</h1>
          <p>Essential information for safe and successful blood donation</p>
          <Link to="/" className="back-home-btn">← Back to Home</Link>
        </div>
      </div>

      <div className="guidelines-container">
        {/* Before Donation Section */}
        <section className="guidelines-section">
          <div className="section-header">
            <h2>🍽️ What to Eat BEFORE Blood Donation</h2>
            <p>Prepare your body 24-48 hours before donating</p>
          </div>
          
          <div className="food-grid">
            {beforeDonationFoods.map((category, index) => (
              <div key={index} className="food-card before-card">
                <div className="food-header">
                  <span className="food-icon">{category.icon}</span>
                  <h3>{category.name}</h3>
                </div>
                <ul className="food-list">
                  {category.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* After Donation Section */}
        <section className="guidelines-section">
          <div className="section-header">
            <h2>🥤 What to Eat AFTER Blood Donation</h2>
            <p>Help your body recover and replenish nutrients</p>
          </div>
          
          <div className="food-grid">
            {afterDonationFoods.map((category, index) => (
              <div key={index} className="food-card after-card">
                <div className="food-header">
                  <span className="food-icon">{category.icon}</span>
                  <h3>{category.name}</h3>
                </div>
                <ul className="food-list">
                  {category.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* General Tips Section */}
        <section className="guidelines-section">
          <div className="section-header">
            <h2>💡 General Tips for Blood Donation</h2>
            <p>Important guidelines for a safe donation experience</p>
          </div>
          
          <div className="tips-grid">
            {generalTips.map((tip, index) => (
              <div key={index} className="tip-card">
                <span className="tip-icon">{tip.icon}</span>
                <p>{tip.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Medical Restrictions Section */}
        <section className="guidelines-section medical-section">
          <div className="section-header">
            <h2>⚠️ Medical Conditions That Prevent Blood Donation</h2>
            <p>Diseases and conditions that disqualify donors for safety reasons</p>
          </div>
          
          <div className="disease-grid">
            {disqualifyingDiseases.map((category, index) => (
              <div key={index} className="disease-card">
                <div className="disease-header">
                  <span className="disease-icon">{category.icon}</span>
                  <h3>{category.category}</h3>
                </div>
                <ul className="disease-list">
                  {category.diseases.map((disease, idx) => (
                    <li key={idx}>{disease}</li>
                  ))}
                </ul>
                <div className="disease-reason">
                  <strong>Reason:</strong> {category.reason}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Important Notice */}
        <section className="important-notice">
          <div className="notice-content">
            <h3>📋 Important Medical Disclaimer</h3>
            <p>
              This information is for educational purposes only. Always consult with healthcare 
              professionals and blood bank staff for personalized medical advice. Medical history 
              and current health status will be evaluated during the screening process.
            </p>
            <div className="emergency-contact">
              <strong>For medical emergencies after donation, contact your healthcare provider immediately.</strong>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/donate-blood" className="donate-btn">
            🩸 Ready to Donate Blood
          </Link>
          <Link to="/request-blood" className="request-btn">
            🏥 Request Blood
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationGuidelines;
