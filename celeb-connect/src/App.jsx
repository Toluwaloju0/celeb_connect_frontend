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
import ValidateOtpPage from './pages/ValidateOtpPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// New Agent Pages
import AgentLoginPage from './pages/AgentLoginPage';
import AgentDashboardPage from './pages/AgentDashboardPage';
import AgentUpdatePasswordPage from './pages/AgentUpdatePasswordPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/verify/email" element={<EmailVerificationPage />} />
          <Route path="/verification/center" element={<VerificationCenterPage />} />
          <Route path="/validate/otp" element={<ValidateOtpPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Agent Routes */}
          <Route path="/agent/login" element={<AgentLoginPage />} />
          <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
          <Route path="/agent/update-password" element={<AgentUpdatePasswordPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;