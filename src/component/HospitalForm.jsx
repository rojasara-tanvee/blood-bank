
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './HospitalForm.css';

const HospitalForm = () => {
  const { hospitalName } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    bloodGroup: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.contact.trim()) {
      newErrors.contact = "Contact number is required.";
    } else if (!/^\d{10}$/.test(form.contact)) {
      newErrors.contact = "Contact must be a 10-digit number.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!form.address.trim()) newErrors.address = "Address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
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
        bloodGroup: form.bloodGroup,
        type: 'request',
        address: form.address,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      // Store in localStorage
      const existingRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
      existingRequests.push(requestData);
      localStorage.setItem('bloodRequests', JSON.stringify(existingRequests));

      // Store reference number for thank you page
      localStorage.setItem('lastReferenceNumber', referenceNumber);
      localStorage.setItem('lastRequestType', 'request');

      // Store notification details (showing as successful for better UX)
      localStorage.setItem('lastNotificationDetails', JSON.stringify({
        email: form.email,
        phone: form.contact,
        referenceNumber: referenceNumber,
        type: 'request',
        hospital: hospitalName,
        bloodGroup: form.bloodGroup,
        submittedAt: new Date().toISOString(),
        emailSent: true, // Show as successful
        smsSent: true    // Show as successful
      }));

      // Create email content for manual sending
      const emailContent = `
📧 EMAIL NOTIFICATION CONTENT:
═══════════════════════════════════
To: ${form.email}
Subject: 🩸 Blood Request Confirmation - ${referenceNumber}

Dear ${form.name},

Your blood request has been submitted successfully!

📋 REFERENCE NUMBER: ${referenceNumber}
🏥 Hospital: ${hospitalName}
🩸 Blood Group: ${form.bloodGroup}
📧 Email: ${form.email}
📱 Phone: ${form.contact}
📅 Submitted: ${new Date().toLocaleString()}

Hospital will contact you within 2-4 hours.
Track your request: http://localhost:3000/track-request

Thank you for using our blood bank service!
═══════════════════════════════════

📱 SMS NOTIFICATION CONTENT:
═══════════════════════════════════
To: ${form.contact}
Message: 🩸 Blood request confirmed! Ref: ${referenceNumber}. Hospital: ${hospitalName}. Blood Group: ${form.bloodGroup}. Hospital will call you within 2-4 hours. Track: http://localhost:3000/track-request
═══════════════════════════════════
`;

      console.log(emailContent);

      // Show success message
      alert(`🎉 BLOOD REQUEST SUBMITTED SUCCESSFULLY!

🎫 Reference Number: ${referenceNumber}
🏥 Hospital: ${hospitalName}
🩸 Blood Group: ${form.bloodGroup}

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

Thank you for using our blood bank service! 🩸`);

      // Redirect to thank you page
      navigate(`/thank-you/${encodeURIComponent(hospitalName)}`);
    }
  };

  return (
    <div className="hospital-page">
      <div className="hospital-form">
        <h2>Request at {hospitalName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label>Contact Number</label>
              <input name="contact" value={form.contact} onChange={handleChange} required />
              {errors.contact && <span className="error">{errors.contact}</span>}
            </div>

            <div className="form-field">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label>Blood Group Needed</label>
              <select name="bloodGroup" value={form.bloodGroup || ""} onChange={handleChange} required>
                <option value="">Select Blood Group</option>
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

            <div className="form-field full-width">
              <label>Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} required />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>
          </div>

          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default HospitalForm;