import React from 'react';
import { Star, ShieldCheck, ArrowLeft, Crown, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const VerificationCenterPage = () => {
  const { logout } = useAuth(); // Get logout function

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 font-sans flex flex-col">
      
      {/* Navbar for Consistency */}
      <nav className="border-b border-white/10 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-brand-gold fill-brand-gold" />
            <h1 className="text-xl font-serif font-bold text-brand-gold">CelebConnect</h1>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-red-500 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg bg-[#1a1a1a] border border-brand-goldDim/20 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto bg-green-900/20 border border-green-500/30 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={32} className="text-green-500" />
            </div>

            <h2 className="text-3xl font-serif text-white mb-2">You are Verified!</h2>
            <p className="text-brand-muted mb-8">
              Your email is confirmed and you have unlocked <span className="text-brand-gold">Level 1</span> access.
            </p>

            <div className="border border-white/10 rounded-xl p-6 mb-8 bg-black/20">
               <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="text-brand-gold" size={20} />
                  <h3 className="text-white font-serif text-lg">Want Premium Access?</h3>
               </div>
               <p className="text-xs text-brand-muted mb-4">
                  Upload your ID to unlock backstage passes and VIP meet & greets.
               </p>
               <button className="w-full bg-brand-gold hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition-colors">
                  Start Identity Verification
               </button>
            </div>

            <Link to="/home" className="text-brand-muted hover:text-white flex items-center justify-center gap-2 text-sm">
               <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCenterPage;