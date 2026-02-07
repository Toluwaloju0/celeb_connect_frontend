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
import BookExperiencePage from './pages/BookExperiencePage'; // User Booking Flow
import UserBookingsPage from './pages/UserBookingsPage';     // User My Bookings
import PaymentPage from './pages/PaymentPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Agent Pages
import AgentLoginPage from './pages/AgentLoginPage';
import AgentDashboardPage from './pages/AgentDashboardPage';
import AgentUpdatePasswordPage from './pages/AgentUpdatePasswordPage';
import AgentEditCelebrityPage from './pages/AgentEditCelebrityPage';
import AgentSchedulePage from './pages/AgentSchedulePage';
import AgentBookingsPage from './pages/AgentBookingsPage';

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
          
          {/* UPDATED: Changed from /book-experience to /book/experience */}
          <Route path="/book/experience" element={<BookExperiencePage />} />
          
          {/* UPDATED: Changed from /my-bookings to /my/bookings */}
          <Route path="/my/bookings" element={<UserBookingsPage />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Agent Routes */}
          <Route path="/agent/login" element={<AgentLoginPage />} />
          <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
          
          {/* UPDATED: Changed from /agent/update-password to /agent/update/password */}
          <Route path="/agent/update/password" element={<AgentUpdatePasswordPage />} />
          
          <Route path="/agent/celeb/edit/:id" element={<AgentEditCelebrityPage />} />
          <Route path="/agent/schedule" element={<AgentSchedulePage />} />
          <Route path="/agent/bookings" element={<AgentBookingsPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;