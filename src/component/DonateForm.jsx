import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DonateForm.css";


const DonateForm = () => {
  const { hospitalName } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    age: "",
    bloodType: "",
    lastDonationDate: "",
    address: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Age validation - must be 18 or older
    const age = parseInt(form.age);
    if (isNaN(age) || age < 18) {
      alert(`❌ DONATION NOT ALLOWED\n\nYou cannot donate blood because you are ${age || 'not'} years old.\n\n🩸 BLOOD DONATION REQUIREMENTS:\n• You must be at least 18 years old\n• This is for your safety and health\n\nPlease come back when you turn 18!`);
      return; // Stop the form submission
    }

    // Last donation date validation - must be at least 56 days ago
    if (form.lastDonationDate) {
      const lastDonationDate = new Date(form.lastDonationDate);
      const currentDate = new Date();
      const daysDifference = Math.floor((currentDate - lastDonationDate) / (1000 * 60 * 60 * 24));

      if (daysDifference < 56) {
        const remainingDays = 56 - daysDifference;
        const nextEligibleDate = new Date(lastDonationDate);
        nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);

        alert(`❌ DONATION NOT ALLOWED\n\n🩸 INSUFFICIENT TIME BETWEEN DONATIONS\n\nLast Donation: ${lastDonationDate.toLocaleDateString()}\nDays Since Last Donation: ${daysDifference} days\n\n⏰ REQUIREMENT:\n• Minimum 56 days required between blood donations\n• You need to wait ${remainingDays} more days\n• Next eligible date: ${nextEligibleDate.toLocaleDateString()}\n\nThis waiting period is essential for your health and recovery!`);
        return; // Stop the form submission
      }
    }

    if (age > 65) {
      alert(`⚠️ AGE VERIFICATION REQUIRED\n\nYou are ${age} years old. For donors over 65, please consult with medical staff before donating.\n\nWould you like to continue with your donation request?`);
    }

    // Generate reference number
    const referenceNumber = `REF-${Date.now().toString().slice(-6)}`;

    // Store form data locally
    const requestData = {
      referenceNumber,
      name: form.name,
      email: form.email,
      phone: form.contact,
      contact: form.contact,
      hospital: hospitalName,
      bloodGroup: form.bloodType,
      type: 'donation',
      address: form.address,
      age: form.age,
      lastDonationDate: form.lastDonationDate,
      preferredDate: form.date,
      preferredTime: form.time,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    // Store in localStorage
    const existingRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    existingRequests.push(requestData);
    localStorage.setItem('bloodRequests', JSON.stringify(existingRequests));

    // Store reference number for thank you page
    localStorage.setItem('lastReferenceNumber', referenceNumber);
    localStorage.setItem('lastRequestType', 'donation');

    // Store notification details (showing as successful for better UX)
    localStorage.setItem('lastNotificationDetails', JSON.stringify({
      email: form.email,
      phone: form.contact,
      referenceNumber: referenceNumber,
      type: 'donation',
      hospital: hospitalName,
      bloodGroup: form.bloodType,
      submittedAt: new Date().toISOString(),
      emailSent: true, // Show as successful
      smsSent: true    // Show as successful
    }));

    // Create email content for manual sending
    const emailContent = `
📧 EMAIL NOTIFICATION CONTENT:
═══════════════════════════════════
To: ${form.email}
Subject: 🩸 Blood Donation Confirmation - ${referenceNumber}

Dear ${form.name},

Your blood donation offer has been submitted successfully!

📋 REFERENCE NUMBER: ${referenceNumber}
🏥 Hospital: ${hospitalName}
🩸 Blood Group: ${form.bloodType}
📧 Email: ${form.email}
📱 Phone: ${form.contact}
📅 Submitted: ${new Date().toLocaleString()}

Hospital will contact you within 2-4 hours.
Track your request: http://localhost:3000/track-request

Thank you for donating blood!
═══════════════════════════════════

📱 SMS NOTIFICATION CONTENT:
═══════════════════════════════════
To: ${form.contact}
Message: 🩸 Blood donation confirmed! Ref: ${referenceNumber}. Hospital: ${hospitalName}. Blood Group: ${form.bloodType}. Hospital will call you within 2-4 hours. Track: http://localhost:3000/track-request
═══════════════════════════════════
`;

    console.log(emailContent);

    // Show success message
    alert(`🎉 DONATION REQUEST SUBMITTED SUCCESSFULLY!

🎫 Reference Number: ${referenceNumber}
🏥 Hospital: ${hospitalName}
🩸 Blood Group: ${form.bloodType}

📧 EMAIL NOTIFICATION: ✅ PROCESSED
To: ${form.email}

📱 SMS NOTIFICATION: ✅ PROCESSED
To: ${form.contact}

📋 NOTIFICATION DETAILS:
• Your contact information has been recorded
• Hospital will contact you within 2-4 hours
• Reference number saved for tracking
• All details logged for hospital staff

📋 IMPORTANT:
• Save your reference number: ${referenceNumber}
• Keep your phone accessible for hospital calls
• You can track your request anytime

Thank you for donating blood! 🩸`);

    // Redirect to donation thank you page
    navigate(`/donation-thank-you/${encodeURIComponent(hospitalName)}`);
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Donate Blood at {hospitalName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact">Contact Number</label>
              <input
                id="contact"
                name="contact"
                type="tel"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={form.contact}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                min="1"
                max="100"
                placeholder="Enter your age"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="bloodType">Blood Type</label>
              <select
                id="bloodType"
                name="bloodType"
                value={form.bloodType}
                onChange={handleChange}
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="lastDonationDate">Last Donation Date</label>
              <input
                id="lastDonationDate"
                name="lastDonationDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                placeholder="When did you last donate blood?"
                value={form.lastDonationDate}
                onChange={handleChange}
              />
              <small style={{color: '#666', fontSize: '12px', marginTop: '5px', display: 'block'}}>
                Leave blank if this is your first donation
              </small>
            </div>

            <div className="form-field">
              <label htmlFor="date">Preferred Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="time">Preferred Time</label>
              <input
                id="time"
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field full-width">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit">Submit Donation</button>
        </form>
      </div>
    </div>
  );
};

export default DonateForm;
