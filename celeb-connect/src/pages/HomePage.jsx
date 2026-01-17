import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Star, Calendar, User, CheckCircle2, AlertTriangle, 
  CreditCard, ShieldCheck, LayoutDashboard, Crown, Bell, Clock, ChevronRight, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  // Destructure logout from context
  const { user, loading, logout } = useAuth();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-brand-gold">Loading...</div>;

  const handleVerificationClick = () => {
    if (!user.is_verified || user.level === 'Unverified') {
      navigate('/verify/email');
    } else {
      navigate('/verification/center');
    }
  };

  const getLevelBadge = (level) => {
    switch(level) {
      case 'Premium': return { style: 'bg-purple-900/30 border-purple-500/30 text-purple-400', icon: <Crown size={12} />, text: 'Premium Level' };
      case 'Basic': return { style: 'bg-blue-900/30 border-blue-500/30 text-blue-400', icon: <Star size={12} />, text: 'Basic Level' };
      case 'Verified': return { style: 'bg-green-900/30 border-green-500/30 text-green-500', icon: <CheckCircle2 size={12} />, text: 'Verified Fan' };
      default: return { style: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-500 cursor-pointer hover:bg-yellow-900/40', icon: <AlertTriangle size={12} />, text: 'Unverified' };
    }
  };

  const badgeProps = getLevelBadge(user.level);

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 font-sans pb-12">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#121212] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-brand-gold fill-brand-gold" />
            <div>
              <h1 className="text-xl font-serif font-bold text-brand-gold leading-none">CelebConnect</h1>
              <p className="text-[10px] text-brand-muted uppercase tracking-wider">Premium Celebrity Experiences</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
             <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
             <NavItem icon={<Star size={18} />} label="Book Experience" />
             <NavItem icon={<Calendar size={18} />} label="My Bookings" />
             
             <button 
               onClick={handleVerificationClick}
               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-brand-muted hover:text-white hover:bg-white/5"
             >
                <ShieldCheck size={18} /> Verification
             </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className={`text-xs font-bold ${badgeProps.text === 'Unverified' ? 'text-yellow-500' : 'text-brand-gold'}`}>{user.level}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center">
                <User className="text-brand-gold" size={20} />
              </div>
            </div>

            {/* LOGOUT BUTTON */}
            <button 
              onClick={logout}
              className="text-brand-muted hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/5"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main content remains the same... */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* Dynamic Notification */}
        {user.level === 'Unverified' && (
          <div onClick={handleVerificationClick} className="border border-brand-gold/30 bg-brand-gold/5 rounded-xl p-4 flex items-start justify-between cursor-pointer hover:bg-brand-gold/10 transition-colors">
            <div className="flex gap-3">
              <AlertTriangle className="text-brand-gold mt-0.5" size={18} />
              <div>
                <h4 className="text-white text-sm font-semibold">Verify your email address</h4>
                <p className="text-brand-muted text-xs">Unlock Basic benefits and secure your account.</p>
              </div>
            </div>
            <button className="text-xs text-brand-gold hover:underline whitespace-nowrap ml-4 flex items-center gap-1">Verify Now →</button>
          </div>
        )}

        <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-serif text-white mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
            <span onClick={user.level === 'Unverified' ? handleVerificationClick : undefined} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${badgeProps.style}`}>
               {badgeProps.icon} {badgeProps.text}
            </span>
          </div>
          <div className="flex gap-4">
            <StatBox icon={<Calendar size={20} />} val="3" label="Upcoming" />
            <StatBox icon={<Star size={20} />} val="12" label="Experiences" />
            <StatBox icon={<CreditCard size={20} />} val="2450" label="Points" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 min-h-[300px]">
                 <h3 className="text-xl font-serif text-white mb-4">Upcoming Bookings</h3>
                 <p className="text-brand-muted text-sm">No bookings scheduled.</p>
              </div>
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 min-h-[300px]">
                 <h3 className="text-xl font-serif text-white mb-4">Recommended For You</h3>
                  <p className="text-brand-muted text-sm">Loading recommendations...</p>
              </div>
           </div>
           <div className="space-y-8">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
                <h3 className="text-xl font-serif text-white mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <div onClick={handleVerificationClick}><ActionRow icon={<ShieldCheck />} title="Verification Center" subtitle="Upgrade your level" /></div>
                  <ActionRow icon={<Clock />} title="Booking History" subtitle="View all past bookings" />
                  <ActionRow icon={<CreditCard />} title="Payment Methods" subtitle="Manage saved options" />
                  <ActionRow icon={<Bell />} title="Notification Settings" subtitle="Customize alerts" />
                </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

// Sub Components
const NavItem = ({ icon, label, active }) => (
  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brand-gold text-black' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}>
    {icon} {label}
  </button>
);
const StatBox = ({ icon, val, label }) => (
  <div className="flex flex-col items-center justify-center w-24 h-24 bg-[#121212] border border-white/5 rounded-2xl hover:border-brand-gold/30 transition-colors">
    <div className="text-brand-muted mb-1">{icon}</div>
    <span className="text-xl font-bold text-white leading-none">{val}</span>
    <span className="text-[10px] text-brand-muted uppercase tracking-wide mt-1">{label}</span>
  </div>
);
const ActionRow = ({ icon, title, subtitle }) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
     <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center text-brand-gold group-hover:text-white transition-colors">{icon}</div>
        <div><h4 className="text-sm font-medium text-white">{title}</h4><p className="text-[10px] text-brand-muted">{subtitle}</p></div>
     </div>
     <ChevronRight size={16} className="text-brand-muted group-hover:translate-x-1 transition-transform" />
  </div>
);

export default HomePage;