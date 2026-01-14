import React from 'react';
import { Star, Calendar, CheckCircle2, Plane, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-[480px] bg-[#1a1a1a] border border-brand-goldDim/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* ... (Keep all existing Header and Feature Code from previous step) ... */}
        {/* ... For brevity, I am not repeating the static text here, insert previous code ... */}
        
        <header className="mb-8 relative z-10">
           {/* Insert Header Content here */}
           <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-black border border-brand-gold/30 flex items-center justify-center shadow-lg shadow-brand-gold/5">
              <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-brand-gold tracking-wide">
                CelebConnect
              </h1>
              <p className="text-xs text-brand-muted uppercase tracking-wider">
                Premium Celebrity Experiences
              </p>
            </div>
          </div>
          <h2 className="text-3xl font-serif text-white mb-3 leading-tight">
            Welcome Back to Exclusive Celebrity Access
          </h2>
          <p className="text-brand-muted text-sm leading-relaxed">
            Sign in to continue your journey with the world's most celebrated personalities. Book appointments, meet & greets, and unforgettable vacation experiences.
          </p>
        </header>

        <div className="space-y-4 mb-8 relative z-10">
          <FeatureCard 
            icon={<Calendar className="w-5 h-5 text-brand-gold" />}
            title="Instant Booking"
            desc="Schedule appointments with celebrities in real-time"
          />
           <FeatureCard 
            icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
            title="Verified Fan Status"
            desc="Get verified to unlock exclusive experiences"
          />
        </div>

        {/* --- LINKED BUTTON --- */}
        <div className="mb-8">
            <button 
              onClick={() => navigate('/login')} 
              className="w-full bg-brand-gold hover:bg-yellow-500 text-black font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-brand-gold/20"
            >
              <span>Sign In / Create Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-xs text-brand-muted mt-3">
                Already have the app? <a href="#" className="text-brand-gold hover:underline">Launch App</a>
            </p>
        </div>
        
         {/* ... (Keep Image Footer code) ... */}
         <div className="relative w-full h-48 rounded-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop" 
            alt="Event Hall" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 p-4 z-20">
            <p className="text-white text-sm font-medium leading-snug">
              Join 100,000+ verified fans experiencing unforgettable moments.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-4 rounded-xl bg-[#222] border border-white/5 hover:border-brand-gold/30 transition-colors duration-300 flex gap-4 items-start group">
      <div className="mt-1 p-2 rounded-lg bg-black/40 group-hover:bg-black/60 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-white font-serif font-bold text-sm mb-1">{title}</h3>
        <p className="text-brand-muted text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default LandingPage;