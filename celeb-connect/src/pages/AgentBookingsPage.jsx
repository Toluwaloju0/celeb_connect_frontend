import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, User, CheckCircle2, Loader2, 
  ArrowLeft, XCircle, Clock, CreditCard, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AgentBookingsPage = () => {
  const { user, agentLogout } = useAuth();
  
  // Data States
  const [celebrities, setCelebrities] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [bookings, setBookings] = useState([]);
  
  // UI States
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [processingId, setProcessingId] = useState(null); // To track which booking is updating

  const PICTURE_BASE = import.meta.env.VITE_PICTURE_BASE || 'uploads';

  // 1. Fetch Roster
  useEffect(() => {
    const fetchRoster = async () => {
      setLoadingRoster(true);
      try {
        const response = await api.get('/agent/celebs');
        if (response.data.status === true && Array.isArray(response.data.data)) {
          setCelebrities(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedId(response.data.data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch roster", error);
      } finally {
        setLoadingRoster(false);
      }
    };
    fetchRoster();
  }, []);

  // 2. Fetch Bookings for Selected Celeb
  useEffect(() => {
    if (!selectedId) return;

    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        // GET /agent/celeb/{celeb_id}/bookings
        const response = await api.get(`/agent/celeb/${selectedId}/bookings`);
        
        if (response.data.status === true && Array.isArray(response.data.data)) {
          setBookings(response.data.data);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [selectedId]);

  // 3. Handle Status Update (Approve/Cancel)
  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!selectedId) return;
    setProcessingId(bookingId);

    try {
      // PATCH /agent/celeb/{celeb_id}/bookings/{booking_id}
      const response = await api.patch(`/agent/celeb/${selectedId}/bookings/${bookingId}`, {
        status: newStatus
      });

      if (response.data.status === true) {
        // Update local state to reflect change immediately
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: newStatus } : b
        ));
        alert(`Booking ${newStatus} successfully.`);
      } else {
        alert(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating booking status");
    } finally {
      setProcessingId(null);
    }
  };

  // --- HELPERS ---
  const getImageUrl = (filename) => {
    if (!filename) return "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop"; 
    if (filename.startsWith('http') || filename.startsWith('https')) return filename;
    const cleanDir = typeof PICTURE_BASE === 'string' ? PICTURE_BASE.replace(/^\/+|\/+$/g, '') : 'uploads';
    return `/${cleanDir}/agent/${filename}`;
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Paid': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle2 size={14} />;
      case 'Paid': return <CreditCard size={14} />;
      case 'Pending': return <Clock size={14} />;
      case 'Cancelled': return <XCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/agent/dashboard" className="text-gray-400 hover:text-white transition-colors">
               <ArrowLeft size={20} />
            </Link>
            <div>
               <h1 className="text-xl font-serif font-bold text-brand-gold leading-none">Booking Management</h1>
               <p className="text-[10px] text-brand-muted uppercase tracking-wider">Agent Portal</p>
            </div>
          </div>
          <button onClick={agentLogout} className="flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-red-500 transition-colors">
             <User size={18} /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* LEFT SIDEBAR (Celeb List) */}
           <div className="lg:col-span-4 space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">Select Celebrity</h2>
              
              <div className="space-y-3 mt-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                 {loadingRoster ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-brand-gold" /></div>
                 ) : celebrities.length === 0 ? (
                    <div className="text-center py-8 text-brand-muted text-sm">No celebrities found.</div>
                 ) : (
                    celebrities.map((celeb) => (
                      <div 
                        key={celeb.id}
                        onClick={() => setSelectedId(celeb.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                          selectedId === celeb.id 
                            ? 'bg-[#1a1a1a] border-brand-gold/30 shadow-lg shadow-black/20' 
                            : 'bg-[#1a1a1a]/50 border-white/5 hover:border-white/10'
                        }`}
                      >
                         <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0 bg-gray-800">
                            <img src={getImageUrl(celeb.profile_url)} alt={celeb.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className={`font-serif font-bold truncate ${selectedId === celeb.id ? 'text-brand-gold' : 'text-white'}`}>
                               {celeb.name}
                            </h4>
                            <p className="text-xs text-brand-muted">{celeb.profession || 'Artist'}</p>
                         </div>
                         {selectedId === celeb.id && <CheckCircle2 size={16} className="text-brand-gold" />}
                      </div>
                    ))
                 )}
              </div>
           </div>

           {/* RIGHT CONTENT (Bookings List) */}
           <div className="lg:col-span-8">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 h-full min-h-[500px] relative">
                 
                 {loadingBookings ? (
                    <div className="h-full flex flex-col items-center justify-center text-brand-muted">
                       <Loader2 className="animate-spin mb-2" size={32} />
                       <p>Loading bookings...</p>
                    </div>
                 ) : selectedId ? (
                    <>
                       <div className="flex justify-between items-end mb-6">
                          <div>
                             <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                                Bookings List
                             </h2>
                             <p className="text-brand-muted text-sm mt-1">
                                Review and manage client booking requests.
                             </p>
                          </div>
                          <div className="text-sm text-brand-muted">
                             Total: <span className="text-white font-bold">{bookings.length}</span>
                          </div>
                       </div>

                       {bookings.length === 0 ? (
                          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                             <Calendar size={48} className="mx-auto text-brand-muted mb-4 opacity-20" />
                             <p className="text-brand-muted">No bookings found for this celebrity.</p>
                          </div>
                       ) : (
                          <div className="space-y-4">
                             {bookings.map((booking) => (
                                <div key={booking.id} className="bg-[#121212] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-brand-gold/20 transition-colors">
                                   
                                   {/* Info */}
                                   <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-1">
                                         <h4 className="text-white font-bold text-lg">
                                            {booking.user_name || 'Client Booking'}
                                         </h4>
                                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 border ${getStatusStyle(booking.status)}`}>
                                            {getStatusIcon(booking.status)} {booking.status}
                                         </span>
                                      </div>
                                      <div className="flex gap-4 text-xs text-brand-muted">
                                         <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(booking.created_at).toLocaleDateString()}</span>
                                         <span className="flex items-center gap-1"><Clock size={12}/> {new Date(booking.created_at).toLocaleTimeString()}</span>
                                         {/* Add service type or other details if available in backend response */}
                                      </div>
                                   </div>

                                   {/* Actions */}
                                   <div className="flex gap-3">
                                      {/* Only show actions if Status is PAID */}
                                      {booking.status === 'Paid' ? (
                                         <>
                                            <button 
                                              onClick={() => handleStatusUpdate(booking.id, 'Approved')}
                                              disabled={processingId === booking.id}
                                              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                            >
                                               {processingId === booking.id ? <Loader2 className="animate-spin" size={12}/> : <CheckCircle2 size={14} />} 
                                               Approve
                                            </button>
                                            <button 
                                              onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                                              disabled={processingId === booking.id}
                                              className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                            >
                                               <XCircle size={14} /> Cancel
                                            </button>
                                         </>
                                      ) : (
                                         <span className="text-xs text-gray-600 italic px-2">
                                            {booking.status === 'Pending' ? 'Waiting for Payment' : 'Action Completed'}
                                         </span>
                                      )}
                                   </div>

                                </div>
                             ))}
                          </div>
                       )}
                    </>
                 ) : (
                    <div className="h-full flex items-center justify-center text-brand-muted">
                       Select a celebrity to view bookings
                    </div>
                 )}

              </div>
           </div>

        </div>
      </main>
    </div>
  );
};

export default AgentBookingsPage;