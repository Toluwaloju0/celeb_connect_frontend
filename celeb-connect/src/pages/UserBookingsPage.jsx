import React, { useState, useEffect } from 'react';
import { 
  Star, Calendar, User, CheckCircle2, AlertTriangle, 
  CreditCard, Loader2, X, MapPin, Briefcase, Clock, 
  ChevronRight, Filter, LogOut, LayoutDashboard, ShieldCheck,
  Bitcoin, Mail, MessageCircle // Added icons
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const UserBookingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Data State
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState('All');

  // Environment Variables
  const PICTURE_BASE = import.meta.env.VITE_PICTURE_BASE;
  const PAYMENT_EMAIL = import.meta.env.VITE_PAYMENT_EMAIL;
  const PAYMENT_WHATSAPP = import.meta.env.VITE_PAYMENT_WHATSAPP;

  // --- FETCH BOOKINGS ---
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await api.get('/user/bookings');
        if (response.data.status === true && Array.isArray(response.data.data)) {
          setBookings(response.data.data);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // --- FETCH DETAILS ---
  const handleViewDetails = async (bookingId) => {
    setLoadingDetails(true);
    setShowDetailModal(true);
    try {
      const response = await api.get(`/user/bookings/${bookingId}`);
      if (response.data.status === true) {
        setSelectedBooking(response.data.data);
      }
    } catch (error) {
      console.error("Error details", error);
      setShowDetailModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  // --- PAYMENT HANDLERS ---
  const getPaymentMessage = () => {
    if (!selectedBooking) return "";
    return `Hello, I would like to confirm payment for Booking ID: ${selectedBooking.id}. Please find the attached payment proof.`;
  };

  const handleWhatsAppPayment = () => {
    const message = encodeURIComponent(getPaymentMessage());
    window.open(`https://wa.me/${PAYMENT_WHATSAPP}?text=${message}`, '_blank');
  };

  const handleEmailPayment = () => {
    const subject = encodeURIComponent(`Payment Confirmation - Booking ${selectedBooking.id}`);
    const body = encodeURIComponent(getPaymentMessage());
    window.open(`mailto:${PAYMENT_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  };

  // --- HELPERS ---
  const getImageUrl = (filename) => {
    if (!filename) return "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop";
    if (filename.startsWith('http')) return filename;
    const cleanDir = PICTURE_BASE ? PICTURE_BASE.replace(/^\/+|\/+$/g, '') : 'uploads';
    return `/${cleanDir}/agent/${filename}`;
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'paid' || s === 'approved') return 'text-green-500 border-green-500/30 bg-green-500/10';
    if (s === 'pending') return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
    if (s === 'cancelled') return 'text-red-500 border-red-500/30 bg-red-500/10';
    return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  };

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 font-sans pb-12">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#121212] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-brand-gold fill-brand-gold" />
            <h1 className="text-xl font-serif font-bold text-brand-gold leading-none">CelebConnect</h1>
          </div>

          <div className="hidden md:flex items-center gap-1">
             <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => navigate('/home')} />
             <NavItem icon={<Star size={18} />} label="Book Experience" onClick={() => navigate('/book/experience')} />
             <NavItem icon={<Calendar size={18} />} label="My Bookings" active />
             <NavItem icon={<ShieldCheck size={18} />} label="Verification" onClick={() => navigate('/verification/center')} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-right">
                <span className="text-sm font-medium text-white hidden sm:block">{user?.name}</span>
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold"><User size={16} className="text-brand-gold"/></div>
            </div>
            <button onClick={logout} className="p-2 rounded-full hover:bg-white/5 text-brand-muted hover:text-red-500 transition-colors"><LogOut size={20}/></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
              <h1 className="text-3xl font-serif text-white font-bold mb-1">My Bookings</h1>
              <p className="text-brand-muted text-sm">Track and manage your celebrity experiences.</p>
           </div>
           
           <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded-xl border border-white/5">
              {['All', 'Pending', 'Paid', 'Cancelled'].map((f) => (
                 <button
                   key={f}
                   onClick={() => setFilter(f)}
                   className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                     filter === f ? 'bg-brand-gold text-black shadow-lg' : 'text-brand-muted hover:text-white'
                   }`}
                 >
                    {f}
                 </button>
              ))}
           </div>
        </div>

        {/* Bookings Grid */}
        <div className="min-h-[400px]">
           {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-brand-gold">
                 <Loader2 className="animate-spin mb-2" size={32} />
                 <p className="text-sm">Loading bookings...</p>
              </div>
           ) : filteredBookings.length === 0 ? (
              <div className="text-center py-20 bg-[#1a1a1a] border border-white/5 rounded-3xl">
                 <Calendar size={48} className="mx-auto text-brand-muted mb-4 opacity-20" />
                 <p className="text-brand-muted">No {filter !== 'All' ? filter.toLowerCase() : ''} bookings found.</p>
                 {filter === 'All' && (
                    <button onClick={() => navigate('/book/experience')} className="mt-4 text-brand-gold hover:underline text-sm">
                       Book your first experience now →
                    </button>
                 )}
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredBookings.map((booking) => (
                    <div 
                      key={booking.id}
                      onClick={() => handleViewDetails(booking.id)}
                      className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition-all cursor-pointer group"
                    >
                       <div className="h-24 bg-gradient-to-r from-gray-900 to-black relative">
                          <div className={`absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(booking.status)}`}>
                             {booking.status}
                          </div>
                       </div>
                       <div className="px-6 pb-6 -mt-10 relative">
                          <div className="flex justify-between items-end">
                             <div className="w-20 h-20 rounded-full border-4 border-[#1a1a1a] overflow-hidden bg-gray-800">
                                <img src={getImageUrl(booking.celeb_image_url)} alt="Celeb" className="w-full h-full object-cover" />
                             </div>
                             <span className="text-xs text-brand-muted mb-1 flex items-center gap-1">
                                View Details <ChevronRight size={12} />
                             </span>
                          </div>
                          <div className="mt-3">
                             <h3 className="text-lg font-bold text-white font-serif">{booking.celeb_name || 'Celebrity'}</h3>
                             <p className="text-brand-gold text-xs font-medium mb-3">{booking.service_type || 'General Booking'}</p>
                             <div className="space-y-2 bg-black/20 p-3 rounded-xl border border-white/5 text-xs text-brand-muted">
                                <div className="flex justify-between">
                                   <span className="flex items-center gap-1"><Calendar size={12} /> Date</span>
                                   <span className="text-gray-300">{new Date(booking.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                   <span className="flex items-center gap-1"><Clock size={12} /> Time</span>
                                   <span className="text-gray-300">{new Date(booking.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>

      </main>

      {/* --- DETAIL MODAL --- */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button onClick={() => setShowDetailModal(false)} className="absolute top-4 right-4 text-brand-muted hover:text-white"><X size={20} /></button>

              {loadingDetails || !selectedBooking ? (
                 <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>
              ) : (
                 <>
                    {/* Header */}
                    <div className="text-center mb-6">
                       <div className="w-24 h-24 mx-auto rounded-full border-2 border-brand-gold/30 overflow-hidden mb-3">
                          <img src={getImageUrl(selectedBooking.celeb_image_url)} alt="Celeb" className="w-full h-full object-cover" />
                       </div>
                       <h2 className="text-2xl font-serif text-white font-bold">{selectedBooking.celeb_name}</h2>
                       <div className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status}
                       </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-3 mb-6">
                       <DetailRow icon={<Briefcase size={14}/>} label="Service" value={selectedBooking.type || selectedBooking.service_type || 'N/A'} />
                       <DetailRow icon={<Calendar size={14}/>} label="Day" value={selectedBooking.day || 'N/A'} />
                       <DetailRow icon={<Clock size={14}/>} label="Created At" value={new Date(selectedBooking.created_at).toLocaleDateString()} />
                    </div>

                    {/* Price Section */}
                    {selectedBooking.price && (
                       <div className="bg-[#121212] border border-brand-gold/20 rounded-xl p-4 mb-6">
                          <p className="text-xs text-brand-muted uppercase tracking-wider mb-2 font-bold">Booking Cost</p>
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-gray-400 text-sm flex items-center gap-1"><CreditCard size={14}/> USD</span>
                             <span className="text-white font-bold font-mono">${selectedBooking.price.usd?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-gray-400 text-sm flex items-center gap-1"><Bitcoin size={14}/> BTC</span>
                             <span className="text-brand-gold font-bold font-mono">{selectedBooking.price.btc} BTC</span>
                          </div>
                       </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                       
                       {/* Payment Buttons (Only if Pending) */}
                       {selectedBooking.status === 'Pending' && (
                          <div className="grid grid-cols-2 gap-3 mb-3">
                             <button 
                               onClick={handleWhatsAppPayment}
                               className="py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                             >
                                <MessageCircle size={16} /> WhatsApp
                             </button>
                             <button 
                               onClick={handleEmailPayment}
                               className="py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                             >
                                <Mail size={16} /> Email
                             </button>
                          </div>
                       )}

                       <button 
                         onClick={() => setShowDetailModal(false)} 
                         className="w-full py-3 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-xl text-sm font-bold transition-colors"
                       >
                          Close Details
                       </button>
                    </div>
                 </>
              )}
           </div>
        </div>
      )}

    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brand-gold text-black' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}>
    {icon} {label}
  </button>
);

const DetailRow = ({ icon, label, value }) => (
  <div className="flex justify-between items-center p-3 rounded-xl bg-[#121212] border border-white/5">
     <span className="text-brand-muted text-xs flex items-center gap-2">{icon} {label}</span>
     <span className="text-white text-sm font-medium">{value}</span>
  </div>
);

export default UserBookingsPage;