import React, { useState } from 'react';
import { 
  Star, Mail, ShieldCheck, Bell, Lock, 
  HelpCircle, ChevronDown, Check, User, LogOut 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout function
  const user = JSON.parse(localStorage.getItem('user') || '{"email": ""}');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/otp/request');
      if (response.data.status === true) {
        alert(response.data.message);
        navigate('/validate/otp');
      } else {
        alert(response.data.message || "Failed to send verification code.");
      }
    } catch (error) {
      console.error("OTP Request Error:", error);
      alert(error.response?.data?.message || "Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 font-sans pb-12">
      
      {/* Navigation */}
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
        <div className="flex items-center gap-2">
           <Star className="w-6 h-6 text-brand-gold fill-brand-gold" />
           <div>
             <h1 className="text-lg font-serif font-bold text-brand-gold leading-none">CelebConnect</h1>
             <p className="text-[10px] text-brand-muted uppercase tracking-wider">Premium Celebrity Experiences</p>
           </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm text-brand-muted">
          <Link to="/home" className="hover:text-brand-gold transition-colors">Dashboard</Link>
          <span className="hover:text-brand-gold transition-colors cursor-pointer">Bookings</span>
          <span className="text-white">Verification</span>
          <span className="hover:text-brand-gold transition-colors cursor-pointer">Agent Portal</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium hover:text-brand-gold cursor-pointer transition-colors">
            <User size={18} /> Profile
          </div>
          {/* LOGOUT BUTTON */}
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-red-500 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 mt-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto text-brand-gold mb-4"><Mail size={48} strokeWidth={1} /></div>
          <h2 className="text-3xl font-serif text-white mb-2">Verify Your Email Address</h2>
          <p className="text-brand-muted text-sm">Enter your email to receive a verification code and unlock Level 1 benefits</p>
        </div>

        <div className="bg-[#1a1a1a] border border-brand-goldDim/20 rounded-3xl p-6 md:p-8 mb-6">
          <div className="mb-6">
             <div className="bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 mb-4 flex items-center">
                <span className="font-bold text-white tracking-wide">{user.email}</span>
             </div>
             
             <button 
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-[#8B7328] hover:bg-[#a08630] text-black font-medium py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
             >
                {loading ? 'Sending Code...' : 'Send OTP Code'} 
                {!loading && <span className="rotate-45"><div className="border-t-2 border-r-2 border-black w-2 h-2"></div></span>} 
             </button>
             <div className="flex gap-2 mt-4 text-xs text-brand-muted"><HelpCircle size={14} className="mt-0.5" /><p>You'll receive a 6-digit verification code via email. The code will expire in 2 minutes.</p></div>
          </div>
          <div className="space-y-5">
             <h3 className="flex items-center gap-2 text-white font-serif"><ShieldCheck size={18} className="text-brand-gold" /> Why We Verify Email Addresses</h3>
             <InfoItem icon={<Lock size={16} className="text-brand-gold/70" />} title="Account Security" desc="Email verification ensures that only you can access your account and protects against unauthorized access." />
             <InfoItem icon={<Bell size={16} className="text-brand-gold/70" />} title="Important Notifications" desc="We'll send booking confirmations, celebrity availability updates, and account alerts to your verified email." />
             <InfoItem icon={<User size={16} className="text-brand-gold/70" />} title="Trust & Credibility" desc="Verified accounts help maintain a trusted community for both fans and celebrities." />
          </div>
        </div>

        {/* Benefits Card */}
        <div className="bg-[#1a1a1a] border border-brand-goldDim/20 rounded-3xl p-6 md:p-8">
           <div className="flex items-center gap-2 text-brand-gold mb-6"><Star size={20} /><h3 className="font-serif text-lg text-white">Level 1 Benefits You'll Unlock</h3></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
              <BenefitItem title="Basic Celebrity Bookings" desc="Access to book available celebrities" />
              <BenefitItem title="Email Notifications" desc="Get notified of new availability" />
              <BenefitItem title="Standard Support" desc="Access to customer support team" />
              <BenefitItem title="Booking History" desc="Track all your bookings in one place" />
           </div>
        </div>
      </main>
    </div>
  );
};

const InfoItem = ({ icon, title, desc }) => (<div className="flex gap-3 items-start"><div className="mt-1">{icon}</div><div><h4 className="text-white text-sm font-medium mb-0.5">{title}</h4><p className="text-brand-muted text-xs leading-relaxed">{desc}</p></div></div>);
const BenefitItem = ({ title, desc }) => (<div className="flex gap-3"><div className="mt-0.5"><Check size={16} className="text-green-500" /></div><div><h4 className="text-white text-lg font-serif mb-1">{title}</h4><p className="text-brand-muted text-sm">{desc}</p></div></div>);

export default EmailVerificationPage;