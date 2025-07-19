import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './component/Header';
import Home from './component/Home';
import BloodBank from './component/BloodBank';
import Cause from './component/Cause';
import About from './component/About';
import Contact from './component/Contact';
import DonateUs from './component/DonateUs';
import Login from './component/Login';
import ForgotPassword from "./component/ForgotPassword";
import Signup from './component/Signup';
import RequestBlood from './component/RequestBlood';
import HospitalForm from './component/HospitalForm';
import DonateBlood from './component/DonateBlood';
import TrackRequest from './component/TrackRequest';
import AdminPanel from './component/AdminPanel';
import DebugRequests from './component/DebugRequests';
import SimpleTest from './component/SimpleTest';
import NotificationDemo from './component/NotificationDemo';
import DonateForm from './component/DonateForm'; // ✅ Make sure this import exists
import ThankYou from './component/ThankYou';
import BloodDonationGuidelines from './component/BloodDonationGuidelines';
import PerfectStatusCard from './component/PerfectStatusCard';
import Footer from './component/Footer';

// Component to conditionally render header
function ConditionalHeader() {
  const location = useLocation();
  const hideHeaderRoutes = ['/admin'];

  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  return <Header />;
}

// Component to conditionally render footer
function ConditionalFooter() {
  const location = useLocation();
  const hideFooterRoutes = ['/admin'];

  if (hideFooterRoutes.includes(location.pathname)) {
    return null;
  }

  return <Footer />;
}

function App() {
  return (
    <Router>
      <ConditionalHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bloodbank" element={<BloodBank />} />
        <Route path="/cause" element={<Cause />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/donateus" element={<DonateUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-blood" element={<RequestBlood />} />
        <Route path="/hospital-form/:hospitalName" element={<HospitalForm />} />
        <Route path="/hospital/:hospitalName/request" element={<HospitalForm />} />
        <Route path="/donate-blood" element={<DonateBlood />} />
        <Route path="/donate/:hospitalName" element={<DonateForm />} /> {/* ✅ Add this */}
        <Route path="/track-request" element={<TrackRequest />} />
        <Route path="/perfect-status" element={<PerfectStatusCard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/debug" element={<DebugRequests />} />
        <Route path="/test" element={<SimpleTest />} />
        <Route path="/notifications" element={<NotificationDemo />} />
        <Route path="/thank-you/:hospitalName" element={<ThankYou />} />
        <Route path="/donation-thank-you/:hospitalName" element={<ThankYou />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blood-donation-guidelines" element={<BloodDonationGuidelines />} />
      </Routes>
      <ConditionalFooter />
    </Router>
  );
}

export default App;
