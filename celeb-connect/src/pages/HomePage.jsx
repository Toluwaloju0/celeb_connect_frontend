import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Star, Calendar, User, CheckCircle2, AlertTriangle, 
  CreditCard, ShieldCheck, LayoutDashboard, Crown, Bell, Clock, ChevronRight,
  LogOut, Loader2, X, MapPin, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();

  // --- STATE ---
  const [stats, setStats] = useState({ total: 0, pending: 0, success: 0 });
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Loading States
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);

  const PICTURE_BASE = import.meta.env.VITE_PICTURE_BASE;

  // --- AUTH CHECK ---
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // --- FETCH DATA ---
  useEffect(() => {
    if (user) {
      fetchStats();
      fetchBookings();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/user/bookings/count');
      if (response.data.status === true) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/user/bookings');
      if (response.data.status === true && Array.isArray(response.data.data)) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleViewBooking = async (bookingId) => {
    setLoadingDetails(true);
    setShowDetailModal(true); // Open modal immediately with loader
    try {
      // GET /user/bookings/{booking_id}
      const response = await api.get(`/user/bookings/${bookingId}`);
      if (response.data.status === true) {
        setSelectedBooking(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching booking details", error);
      alert("Failed to load booking details");
      setShowDetailModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  // --- HELPERS ---
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

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'paid' || s === 'approved') return 'text-green-500 border-green-500/30 bg-green-500/10';
    if (s === 'pending') return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
    if (s === 'cancelled') return 'text-red-500 border-red-500/30 bg-red-500/10';
    return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  };

  const getImageUrl = (filename) => {
    if (!filename) return "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop";
    if (filename.startsWith('http')) return filename;
    const cleanDir = PICTURE_BASE ? PICTURE_BASE.replace(/^\/+|\/+$/g, '') : 'uploads';
    return `/${cleanDir}/agent/${filename}`; // Assuming celeb images are stored here
  };

  const badgeProps = getLevelBadge(user?.level);

  if (authLoading || !user) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-brand-gold"><Loader2 className="animate-spin" /></div>;

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
             <NavItem 
                icon={<Star size={18} />} 
                label="Book Experience" 
                onClick={() => navigate('/book/experience')} 
             />
             {/* <NavItem icon={<Calendar size={18} />} label="My Bookings" /> */}
             <NavItem 
                icon={<Calendar size={18} />} 
                label="My Bookings" 
                onClick={() => navigate('/my/bookings')} 
             />
             <button 
               onClick={handleVerificationClick}
               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-brand-muted hover:text-white hover:bg-white/5"
             >
                <ShieldCheck size={18} /> Verification
             </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className={`text-xs font-bold ${badgeProps.text === 'Unverified' ? 'text-yellow-500' : 'text-brand-gold'}`}>{user.level}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center">
                <User className="text-brand-gold" size={20} />
              </div>
            </div>
            <button onClick={logout} className="text-brand-muted hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/5">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">

        {/* Verification Notification */}
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

        {/* Welcome & Stats */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-serif text-white mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
            <span onClick={user.level === 'Unverified' ? handleVerificationClick : undefined} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${badgeProps.style}`}>
               {badgeProps.icon} {badgeProps.text}
            </span>
          </div>
          
          <div className="flex gap-4">
            <StatBox icon={<Calendar size={20} />} val={stats.total} label="Total Bookings" loading={loadingStats} />
            <StatBox icon={<Clock size={20} />} val={stats.pending} label="Pending" loading={loadingStats} />
            <StatBox icon={<CheckCircle2 size={20} />} val={stats.success} label="Successful" loading={loadingStats} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* LEFT: BOOKINGS LIST */}
           <div className="lg:col-span-2 space-y-8">
              <div>
                 <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-serif text-white">Your Bookings</h3>
                    <button className="text-xs text-white hover:text-brand-gold transition-colors">View All →</button>
                 </div>
                 
                 <div className="space-y-4">
                    {loadingBookings ? (
                       <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-gold" /></div>
                    ) : bookings.length === 0 ? (
                       <div className="text-center py-10 bg-[#1a1a1a] rounded-2xl border border-white/5 text-brand-muted">
                          No bookings found. Start exploring celebrities!
                       </div>
                    ) : (
                       bookings.map((booking) => (
                          <div 
                            key={booking.id}
                            onClick={() => handleViewBooking(booking.id)}
                            className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 hover:border-brand-gold/20 transition-all cursor-pointer group relative overflow-hidden"
                          >
                             <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-3">
                                   <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden border border-white/10">
                                      {/* Assuming booking object has celeb_name and celeb_image or similar */}
                                      <img src={getImageUrl(booking.celeb_image_url)} alt="Celeb" className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                      <h4 className="text-white font-serif font-bold text-sm">{booking.celeb_name || 'Celebrity'}</h4>
                                      <p className="text-xs text-brand-muted flex items-center gap-1">
                                         <Clock size={10} /> {new Date(booking.created_at).toLocaleDateString()}
                                      </p>
                                   </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${getStatusColor(booking.status)}`}>
                                   {booking.status}
                                </span>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>

              {/* Recommended Section (Static Placeholder for now) */}
              <div>
                 <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-serif text-white">Recommended For You</h3>
                 </div>
                 <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 min-h-[150px] flex items-center justify-center text-brand-muted text-sm">
                    Personalized recommendations coming soon.
                 </div>
              </div>
           </div>

           {/* RIGHT: ACTIONS & IMPACT */}
           <div className="space-y-8">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
                <h3 className="text-xl font-serif text-white mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <div onClick={handleVerificationClick}>
                    <ActionRow icon={<ShieldCheck />} title="Verification Center" subtitle="Upgrade your level" />
                  </div>
                  <ActionRow 
                    icon={<Calendar />} 
                    title="Book a Celebrity" 
                    subtitle="Explore roster" 
                    onClick={() => navigate('/book/experience')}
                  />
                  <ActionRow icon={<CreditCard />} title="Payment Methods" subtitle="Manage saved options" />
                  <ActionRow icon={<Bell />} title="Notification Settings" subtitle="Customize alerts" />
                </div>
              </div>
              
               <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
                 <h3 className="text-xl font-serif text-white mb-6">Your Impact</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                      <span className="text-sm text-brand-muted">Total Spent</span>
                      <span className="text-lg font-serif text-brand-gold">$0.00</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* --- BOOKING DETAILS MODAL --- */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-brand-gold/20 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
              <button 
                onClick={() => { setShowDetailModal(false); setSelectedBooking(null); }} 
                className="absolute top-4 right-4 text-brand-muted hover:text-white"
              >
                 <X size={20} />
              </button>

              {loadingDetails || !selectedBooking ? (
                 <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="animate-spin text-brand-gold mb-2" />
                    <p className="text-brand-muted text-sm">Loading booking details...</p>
                 </div>
              ) : (
                 <>
                    <div className="text-center mb-6">
                       <div className="w-20 h-20 mx-auto rounded-full border-2 border-brand-gold/30 overflow-hidden mb-3">
                          <img src={getImageUrl(selectedBooking.celeb_image_url)} alt="Celeb" className="w-full h-full object-cover" />
                       </div>
                       <h2 className="text-xl font-serif text-white font-bold">{selectedBooking.celeb_name}</h2>
                       <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase mt-2 border ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status}
                       </div>
                    </div>

                    <div className="space-y-4 bg-[#121212] p-4 rounded-xl border border-white/5">
                       <div className="flex justify-between items-center pb-3 border-b border-white/5">
                          <span className="text-brand-muted text-xs flex items-center gap-2"><Calendar size={14}/> Request Date</span>
                          <span className="text-white text-sm">{new Date(selectedBooking.created_at).toLocaleDateString()}</span>
                       </div>
                       <div className="flex justify-between items-center pb-3 border-b border-white/5">
                          <span className="text-brand-muted text-xs flex items-center gap-2"><MapPin size={14}/> Location</span>
                          <span className="text-white text-sm">{selectedBooking.location || 'Online'}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-brand-muted text-xs flex items-center gap-2"><Briefcase size={14}/> Service Type</span>
                          <span className="text-white text-sm">{selectedBooking.service_type || 'General Booking'}</span>
                       </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                       <button 
                         onClick={() => setShowDetailModal(false)}
                         className="flex-1 py-3 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-xl text-sm font-bold transition-colors"
                       >
                          Close
                       </button>
                       {selectedBooking.status === 'Pending' && (
                          <button className="flex-1 py-3 bg-brand-gold hover:bg-yellow-500 text-black rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                             <CreditCard size={16} /> Proceed to Pay
                          </button>
                       )}
                    </div>
                 </>
              )}
           </div>
        </div>
      )}

    </div>
  );
};

// --- SUB COMPONENTS ---
const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brand-gold text-black' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

const StatBox = ({ icon, val, label, loading }) => (
  <div className="flex flex-col items-center justify-center w-24 h-24 bg-[#121212] border border-white/5 rounded-2xl hover:border-brand-gold/30 transition-colors">
    <div className="text-brand-muted mb-1">{icon}</div>
    {loading ? <Loader2 className="animate-spin text-white my-1" size={20} /> : <span className="text-xl font-bold text-white leading-none">{val}</span>}
    <span className="text-[10px] text-brand-muted uppercase tracking-wide mt-1">{label}</span>
  </div>
);

const ActionRow = ({ icon, title, subtitle, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
  >
     <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center text-brand-gold group-hover:text-white transition-colors">
           {icon}
        </div>
        <div>
           <h4 className="text-sm font-medium text-white">{title}</h4>
           <p className="text-[10px] text-brand-muted">{subtitle}</p>
        </div>
     </div>
     <ChevronRight size={16} className="text-brand-muted group-hover:translate-x-1 transition-transform" />
  </div>
);

export default HomePage;