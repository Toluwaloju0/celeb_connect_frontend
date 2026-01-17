import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import VerificationCenterPage from './pages/VerificationCenterPage';
import ValidateOtpPage from './pages/ValidateOtpPage'; // Import the new page

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          
          <Route path="/verify/email" element={<EmailVerificationPage />} />
          <Route path="/verification/center" element={<VerificationCenterPage />} />
          <Route path="/validate/otp" element={<ValidateOtpPage />} /> {/* Connected */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;