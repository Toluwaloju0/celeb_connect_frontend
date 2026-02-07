import React, { useState, useEffect } from 'react';
import { 
  Search, Users, Star, UserCheck, Loader2, 
  Briefcase, ArrowLeft, MapPin, Calendar, ChevronRight, ChevronLeft,
  CheckCircle2, XCircle, Clock, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const BookExperiencePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- VIEW STATE ---
  const [view, setView] = useState('list'); 

  // --- DATA STATES ---
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedCeleb, setSelectedCeleb] = useState(null);
  const [availability, setAvailability] = useState(null);

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [hasMore, setHasMore] = useState(true);

  // --- LOADING STATES ---
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // --- BOOKING STATE ---
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null); 
  const [bookingType, setBookingType] = useState('One-Time');

  const PICTURE_BASE = import.meta.env.VITE_PICTURE_BASE;

  // Constants
  const DAYS_MAP = [
    { key: 'monday', label: 'Monday', enum: 'MONDAY' },
    { key: 'tuesday', label: 'Tuesday', enum: 'TUESDAY' },
    { key: 'wednessday', label: 'Wednesday', enum: 'WEDNESDAY' },
    { key: 'thursday', label: 'Thursday', enum: 'THURSDAY' },
    { key: 'friday', label: 'Friday', enum: 'FRIDAY' },
    { key: 'saturday', label: 'Saturday', enum: 'SATURDAY' },
    { key: 'sunday', label: 'Sunday', enum: 'SUNDAY' },
  ];

  const BOOKING_TYPES = [
    { value: 'One-Time', label: 'One-Time Event', desc: 'Single event appearance or short meet.' },
    { value: 'Vacation', label: 'Vacation', desc: 'Companion for trips or getaways.' },
    { value: 'Long-Meet', label: 'Long-Meet', desc: 'Extended interaction session (>4 hours).' },
  ];

  // --- 1. FETCH AGENTS ---
  useEffect(() => {
    if (view === 'list') {
      fetchAgents();
    }
  }, [page, view]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/agents', { params: { page, limit } });
      if (response.data.status === true && Array.isArray(response.data.data)) {
        setAgents(response.data.data);
        setHasMore(response.data.data.length === limit);
      } else {
        setAgents([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch agents", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. FETCH AGENT DETAILS ---
  const handleAgentClick = async (agentId) => {
    setLoading(true);
    try {
      const response = await api.get(`/user/agents/${agentId}`);
      if (response.data.status === true) {
        setSelectedAgent(response.data.data);
        setView('agent_details');
      }
    } catch (error) {
      alert("Could not load agent details.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. FETCH AVAILABILITY ---
  const handleCelebClick = async (celeb) => {
    setSelectedCeleb(celeb);
    setLoading(true);
    try {
      const response = await api.get(`/user/celeb/${celeb.id}/availability`);
      if (response.data.status === true) {
        setAvailability(response.data.data || {});
        setView('availability');
      } else {
        setAvailability({});
        setView('availability');
      }
    } catch (error) {
      alert("Could not load availability.");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. OPEN BOOKING MODAL ---
  const handleSelectDay = (day) => {
    setSelectedDay(day);
    setBookingType('One-Time');
    setShowBookingModal(true);
  };

  // --- 5. SUBMIT BOOKING (FIXED) ---
  const handleConfirmBooking = async () => {
    if (!selectedCeleb || !selectedDay) return;
    
    setBookingLoading(true);
    try {
      const response = await api.post(`/user/${selectedCeleb.id}/book`, {
        day: selectedDay.enum, 
        type: bookingType      
      });

      console.log("Booking Response:", response.data); // Debugging line

      if (response.data.status === true) {
        // Safe check for ID location
        const data = response.data.data;
        let bookingId = null;

        // Check if 'data' contains 'id' or 'booking_id' or is the ID itself
        if (data && typeof data === 'object') {
            bookingId = data.id || data.booking_id;
        } else if (typeof data === 'string' || typeof data === 'number') {
            bookingId = data;
        }

        if (bookingId) {
            navigate(`/payment/${bookingId}`); 
        } else {
            // Fallback if booking was successful but ID isn't clear
            console.warn("Booking successful but ID missing in expected format", data);
            alert("Booking request submitted! Redirecting to dashboard.");
            navigate('/my-bookings');
        }
      } else {
        alert(response.data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert(error.response?.data?.message || "An error occurred while booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  // --- HELPERS ---
  const getImageUrl = (filename) => {
    if (!filename) return "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop"; 
    if (filename.startsWith('http') || filename.startsWith('https')) return filename;
    const cleanDir = typeof PICTURE_BASE === 'string' ? PICTURE_BASE.replace(/^\/+|\/+$/g, '') : 'uploads';
    return `/${cleanDir}/agent/${filename}`;
  };

  // --- RENDERERS ---
  
  const renderAgentList = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white font-bold mb-2">Book an Experience</h1>
        <p className="text-brand-muted text-sm">Select an agent to browse their exclusive celebrity roster.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>
        ) : agents.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-[#1a1a1a] rounded-2xl border border-white/5 text-brand-muted">No agents found.</div>
        ) : (
           agents.map((agent) => (
             <div key={agent.id} onClick={() => handleAgentClick(agent.id)} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-brand-gold/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-white/10 overflow-hidden"><img src={getImageUrl(agent.profile_url)} alt={agent.name} className="w-full h-full object-cover" /></div>
                   <div><h3 className="text-white font-serif font-bold text-lg group-hover:text-brand-gold transition-colors">{agent.name}</h3><span className="text-xs text-brand-muted bg-white/5 px-2 py-1 rounded">Tier {agent.tier} Agent</span></div>
                </div>
                <div className="flex items-center justify-between text-xs text-brand-muted pt-4 border-t border-white/5"><span className="flex items-center gap-1"><Users size={14} /> View Roster</span><ChevronRight size={16} /></div>
             </div>
           ))
        )}
      </div>
      {!loading && agents.length > 0 && (
        <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-8">
           <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 disabled:opacity-50"><ChevronLeft size={16} /> Previous</button>
           <span className="text-sm text-brand-muted">Page {page}</span>
           <button onClick={() => setPage(p => p + 1)} disabled={!hasMore} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 disabled:opacity-50">Next <ChevronRight size={16} /></button>
        </div>
      )}
    </>
  );

  const renderAgentDetails = () => (
    <>
      <button onClick={() => setView('list')} className="flex items-center gap-2 text-brand-muted hover:text-white mb-6 text-sm"><ArrowLeft size={16} /> Back to Agents</button>
      {selectedAgent && (
        <div className="space-y-8">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full border-2 border-brand-gold/30 overflow-hidden"><img src={getImageUrl(selectedAgent.agent.profile_url)} alt="Agent" className="w-full h-full object-cover" /></div>
              <div className="text-center md:text-left flex-1">
                 <h2 className="text-3xl font-serif text-white mb-2">{selectedAgent.agent.name}</h2>
                 <p className="text-brand-muted text-sm flex items-center justify-center md:justify-start gap-2"><Briefcase size={14} /> Tier {selectedAgent.agent.tier} Representative</p>
                 {selectedAgent.agent.email_verified && <span className="inline-flex items-center gap-1 text-green-500 text-xs mt-2"><UserCheck size={12}/> Verified Agent</span>}
              </div>
           </div>
           <div>
              <h3 className="text-xl font-serif text-white mb-6 pl-2 border-l-4 border-brand-gold">Managed Celebrities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {selectedAgent.celebs.map((celeb) => (
                    <div key={celeb.id} onClick={() => handleCelebClick(celeb)} className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition-all cursor-pointer group">
                       <div className="h-48 overflow-hidden bg-gray-800"><img src={getImageUrl(celeb.profile_url)} alt={celeb.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                       <div className="p-5">
                          <h4 className="text-lg font-bold text-white mb-1">{celeb.name}</h4>
                          <p className="text-sm text-brand-gold mb-3">{celeb.profession}</p>
                          <div className="flex items-center gap-4 text-xs text-brand-muted"><span className="flex items-center gap-1"><MapPin size={12} /> {celeb.location || 'N/A'}</span></div>
                          {celeb.bio && <p className="text-xs text-gray-500 mt-3 line-clamp-2">{celeb.bio}</p>}
                       </div>
                    </div>
                 ))}
                 {selectedAgent.celebs.length === 0 && (<div className="col-span-full py-10 text-center text-brand-muted">This agent has no celebrities listed yet.</div>)}
              </div>
           </div>
        </div>
      )}
    </>
  );

  const renderAvailability = () => (
    <>
      <button onClick={() => setView('agent_details')} className="flex items-center gap-2 text-brand-muted hover:text-white mb-6 text-sm"><ArrowLeft size={16} /> Back to Roster</button>
      {selectedCeleb && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
               <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 text-center sticky top-24">
                  <div className="w-32 h-32 mx-auto rounded-full border-2 border-brand-gold/30 overflow-hidden mb-4"><img src={getImageUrl(selectedCeleb.profile_url)} alt={selectedCeleb.name} className="w-full h-full object-cover" /></div>
                  <h2 className="text-2xl font-serif text-white mb-1">{selectedCeleb.name}</h2>
                  <p className="text-brand-muted text-sm mb-4">{selectedCeleb.profession}</p>
                  {selectedCeleb.bio && <div className="bg-black/30 rounded-xl p-4 text-left mb-4"><p className="text-xs text-gray-400 italic">"{selectedCeleb.bio}"</p></div>}
                  <div className="text-xs text-brand-muted border-t border-white/5 pt-4"><p>Managed by: <span className="text-white">{selectedAgent.agent.name}</span></p></div>
               </div>
            </div>
            <div className="lg:col-span-2">
               <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8">
                  <div className="mb-6"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Calendar className="text-brand-gold" size={20} /> Select a Day</h3><p className="text-sm text-brand-muted">Choose an available day to proceed.</p></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {DAYS_MAP.map((day) => {
                        const isAvailable = availability[day.key] === true;
                        return (
                           <button key={day.key} disabled={!isAvailable} onClick={() => isAvailable && handleSelectDay(day)} className={`p-5 rounded-xl border flex items-center justify-between transition-all group text-left ${isAvailable ? 'bg-[#121212] border-brand-gold/30 hover:bg-brand-gold hover:text-black cursor-pointer' : 'bg-[#0f0f0f] border-white/5 opacity-50 cursor-not-allowed'}`}>
                              <div><span className={`block font-bold text-sm uppercase ${isAvailable ? 'group-hover:text-black' : 'text-gray-500'}`}>{day.label}</span><span className={`text-[10px] ${isAvailable ? 'text-green-500 group-hover:text-black/70' : 'text-red-900'}`}>{isAvailable ? 'Available' : 'Unavailable'}</span></div>
                              {isAvailable ? <div className="w-8 h-8 rounded-full bg-brand-gold/10 group-hover:bg-black/20 flex items-center justify-center text-brand-gold group-hover:text-black"><ChevronRight size={16} /></div> : <XCircle size={16} className="text-gray-700" />}
                           </button>
                        );
                     })}
                  </div>
               </div>
            </div>
         </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      <nav className="border-b border-white/10 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2"><Star className="w-6 h-6 text-brand-gold fill-brand-gold" /><div><h1 className="text-xl font-serif font-bold text-brand-gold leading-none">CelebConnect</h1><p className="text-[10px] text-brand-muted uppercase tracking-wider">Book Experience</p></div></div>
          <button onClick={() => navigate('/home')} className="text-sm font-medium text-brand-muted hover:text-white transition-colors">Exit</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
         {view === 'list' && renderAgentList()}
         {view === 'agent_details' && renderAgentDetails()}
         {view === 'availability' && renderAvailability()}
      </main>

      {showBookingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
              <h2 className="text-xl font-serif text-white mb-2">Confirm Booking Details</h2>
              <p className="text-brand-muted text-sm mb-6">You are requesting to book <span className="text-white font-bold">{selectedCeleb.name}</span> for <span className="text-brand-gold">{selectedDay?.label}</span>.</p>
              
              <div className="space-y-3 mb-8">
                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Experience Type</p>
                 {BOOKING_TYPES.map((type) => (
                    <div key={type.value} onClick={() => setBookingType(type.value)} className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${bookingType === type.value ? 'bg-brand-gold/10 border-brand-gold text-white' : 'bg-[#121212] border-white/10 text-gray-400 hover:border-white/30'}`}>
                       <div><span className={`block font-bold text-sm ${bookingType === type.value ? 'text-brand-gold' : 'text-white'}`}>{type.label}</span><span className="text-xs opacity-70">{type.desc}</span></div>
                       {bookingType === type.value && <CheckCircle2 size={18} className="text-brand-gold" />}
                    </div>
                 ))}
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setShowBookingModal(false)} className="flex-1 py-3 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-xl text-sm font-bold transition-colors">Cancel</button>
                 <button onClick={handleConfirmBooking} disabled={bookingLoading} className="flex-1 py-3 bg-brand-gold hover:bg-yellow-500 text-black rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">{bookingLoading ? <Loader2 className="animate-spin" /> : 'Proceed to Payment'}</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default BookExperiencePage;