import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, Mail, Key, Check, ArrowRight, Edit2, 
  HelpCircle, LogOut, User, Loader2 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ValidateOtpPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(111);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  
  const inputRefs = useRef([]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- UPDATED INPUT LOGIC ---
  const handleChange = (index, e) => {
    const value = e.target.value;
    
    // Get the last character typed
    const char = value.substring(value.length - 1);

    // Allow alphanumeric characters (a-z, A-Z, 0-9)
    // If the character is not alphanumeric and not empty (backspace), ignore it
    if (value && !/^[a-zA-Z0-9]$/.test(char)) return;

    const newOtp = [...otp];
    
    // Store exact case (No toUpperCase)
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto-focus next input
    if (char && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit if all filled
    const combinedOtp = newOtp.join('');
    // We check if we are on the last index and it has a value, OR if the state is fully filled now
    // Note: React state update is async, so we use the local 'newOtp' to check length
    if (newOtp.every(v => v !== '') && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (codeToVerify) => {
    // Use the argument if passed (auto-submit), otherwise use state
    const code = typeof codeToVerify === 'string' ? codeToVerify : otp.join('');
    
    if (code.length !== 6) return;
    
    setLoading(true);
    setError('');

    try {
      // Sends code exactly as typed (case sensitive)
      const response = await api.post('/auth/otp/validate', { otp_code: code });

      if (response.data.status === true) {
        // Optimistic update
        const updatedUser = { ...user, is_verified: true, level: 'Basic' };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        navigate('/verification/center'); 
      } else {
        setError(response.data.message || 'Invalid code');
        setAttempts(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Verification failed');
      setAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(120);
      setAttempts(0);
      setError('');
      await api.get('/auth/otp/request');
      alert('Code resent successfully');
    } catch (err) {
      alert('Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 font-sans pb-12">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#121212] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Star className="w-6 h-6 text-brand-gold fill-brand-gold" />
             <h1 className="text-xl font-serif font-bold text-brand-gold">CelebConnect</h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-brand-muted">
             <Link to="/home" className="hover:text-brand-gold">Dashboard</Link>
             <span>Verification</span>
             <span>Agent Portal</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm font-medium hover:text-brand-gold cursor-pointer">
                <User size={18} /> Profile
             </div>
             <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-red-500 transition-colors">
                <LogOut size={18} /> Logout
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 mt-8 space-y-6">

        {/* 1. Progress Stepper */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 flex justify-between items-center relative overflow-hidden">
           <Step status="completed" icon={<Mail size={20} />} label="Email Sent" />
           <div className="h-0.5 w-16 bg-green-500/50"></div>
           <Step status="active" icon={<Key size={20} />} label="Enter Code" />
           <div className="h-0.5 w-16 bg-white/10"></div>
           <Step status="pending" icon={<Check size={20} />} label="Verified" />
        </div>

        {/* 2. Level Transition Card */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8">
           <div className="flex items-center gap-6 mb-6">
              <LevelBadge num="0" label="Current Level" title="Unverified" active={false} />
              <ArrowRight className="text-brand-gold" />
              <LevelBadge num="1" label="Target Level" title="Email Verified" active={true} />
           </div>
           <div className="border-t border-white/10 pt-4">
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">Next Steps:</span> Complete email verification to unlock Level 1 benefits and access basic celebrity bookings.
              </p>
           </div>
        </div>

        {/* 3. Main Verification Card */}
        <div className="bg-[#1a1a1a] border border-brand-goldDim/20 rounded-3xl p-8 text-center">
           
           <h2 className="text-3xl font-serif text-white mb-2">Verify Your Email</h2>
           <p className="text-brand-muted text-sm mb-8">We've sent a 6-digit code to your email address</p>

           {/* Email Display */}
           <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-4 flex justify-between items-center mb-8 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                 <Mail className="text-brand-gold" size={18} />
                 <div className="text-left">
                    <p className="text-[10px] text-brand-muted uppercase">Verification email sent to</p>
                    <p className="text-white font-semibold text-sm">{user?.email || 'email@example.com'}</p>
                 </div>
              </div>
              <Link to="/verify/email" className="text-brand-gold text-sm font-semibold hover:text-white transition-colors flex items-center gap-1">
                 Edit
              </Link>
           </div>

           {/* Input Fields */}
           <div className="mb-2">
              <label className="text-white text-sm font-semibold mb-4 block">Enter Verification Code</label>
              <div className="flex justify-center gap-2 sm:gap-4 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl bg-white text-black text-center text-xl font-bold focus:outline-none focus:ring-4 focus:ring-brand-gold/50 transition-all border-none"
                    // Note: Removed 'uppercase' class so input looks exactly as typed
                    // Note: Removed type='number' or inputMode='numeric' to allow alphabets
                  />
                ))}
              </div>
           </div>

           {/* Timer & Resend */}
           <div className="flex justify-between items-center max-w-xs mx-auto text-sm mb-8">
              <span className="text-brand-muted">Code expires in <span className="text-white font-mono font-bold">{formatTime(timeLeft)}</span></span>
              <button onClick={handleResend} className="text-brand-muted hover:text-brand-gold underline decoration-brand-muted/50 hover:decoration-brand-gold">
                Resend Code
              </button>
           </div>

           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

           <button 
             onClick={() => handleVerify()}
             disabled={loading || otp.join('').length !== 6}
             className="w-full max-w-md bg-[#8B7328] hover:bg-[#a08630] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
           >
             {loading ? <Loader2 className="animate-spin" /> : 'Verify Email'}
           </button>

           <p className="text-brand-muted text-xs mt-6">Attempts: {attempts}/5</p>

        </div>

        {/* 4. Help Section */}
        <div className="border border-white/10 rounded-2xl p-6 bg-[#1a1a1a]/50">
           <h3 className="font-serif text-white flex items-center gap-2 mb-3">
             <HelpCircle size={16} className="text-brand-gold" /> Need Help?
           </h3>
           <ul className="text-sm text-brand-muted space-y-1 ml-6 list-disc marker:text-brand-muted/50">
              <li>Check your spam/junk folder if you don't see the email</li>
              <li>Make sure you entered the correct email address</li>
              <li>Contact support if you continue to have issues</li>
           </ul>
        </div>

      </main>
    </div>
  );
};

const Step = ({ status, icon, label }) => {
  let circleStyle = "bg-[#2a2a2a] text-brand-muted border-white/10";
  let textStyle = "text-brand-muted";

  if (status === 'completed') {
    circleStyle = "bg-green-500/10 text-green-500 border-green-500/30";
    textStyle = "text-white";
  } else if (status === 'active') {
    circleStyle = "bg-brand-gold text-black border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]";
    textStyle = "text-white font-bold";
  }

  return (
    <div className="flex flex-col items-center gap-2 z-10">
       <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${circleStyle}`}>
          {icon}
       </div>
       <span className={`text-xs ${textStyle}`}>{label}</span>
    </div>
  );
};

const LevelBadge = ({ num, label, title, active }) => (
  <div className="flex items-center gap-3">
     <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-serif ${active ? 'bg-[#2a2a2a] text-white border border-white/20' : 'bg-[#151515] text-brand-muted border border-white/5'}`}>
        {num}
     </div>
     <div>
        <p className="text-[10px] text-brand-muted uppercase tracking-wider">{label}</p>
        <p className={`font-bold text-lg leading-none ${active ? 'text-white' : 'text-gray-500'}`}>{title}</p>
     </div>
  </div>
);

export default ValidateOtpPage;