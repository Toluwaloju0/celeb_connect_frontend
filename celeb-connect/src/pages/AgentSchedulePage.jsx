import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, User, CheckCircle2, Loader2, Save, 
  Clock, ArrowLeft, AlertCircle, Check, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AgentSchedulePage = () => {
  const { user, agentLogout } = useAuth();
  const navigate = useNavigate();

  // Data States
  const [celebrities, setCelebrities] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [availability, setAvailability] = useState({});
  
  // UI States
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Safely get env variable (fallback to 'uploads' if undefined)
  const PICTURE_BASE = import.meta.env.VITE_PICTURE_BASE || 'uploads';

  // Configuration mapping (handling backend 'wednessday' key)
  const DAYS_MAP = [
    { key: 'monday', label: 'Monday', enum: 'MONDAY' },
    { key: 'tuesday', label: 'Tuesday', enum: 'TUESDAY' },
    { key: 'wednessday', label: 'Wednesday', enum: 'WEDNESDAY' }, 
    { key: 'thursday', label: 'Thursday', enum: 'THURSDAY' },
    { key: 'friday', label: 'Friday', enum: 'FRIDAY' },
    { key: 'saturday', label: 'Saturday', enum: 'SATURDAY' },
    { key: 'sunday', label: 'Sunday', enum: 'SUNDAY' },
  ];

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

  // 2. Fetch Availability for Selected Celeb
  useEffect(() => {
    if (!selectedId) return;

    const fetchAvailability = async () => {
      setLoadingAvail(true);
      setHasChanges(false); 
      try {
        const response = await api.get(`/agent/celeb/${selectedId}/availability`);
        
        if (response.data.status === true && response.data.data) {
          setAvailability(response.data.data);
        } else {
          setAvailability({});
        }
      } catch (error) {
        // If 404 or no availability, reset to empty
        setAvailability({});
      } finally {
        setLoadingAvail(false);
      }
    };

    fetchAvailability();
  }, [selectedId]);

  // 3. Handle Day Toggle
  const toggleDay = (dayKey) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
    setHasChanges(true); 
  };

  // 4. Handle Save/Update
  const handleUpdate = async () => {
    setUpdating(true);
    
    // Construct payload: List of ENUM strings for days that are TRUE
    const activeDays = DAYS_MAP
      .filter(day => availability[day.key] === true)
      .map(day => day.enum);

    try {
      const response = await api.patch(`/agent/celeb/${selectedId}/availability`, {
        days: activeDays
      });

      if (response.data.status === true) {
        setAvailability(response.data.data);
        setHasChanges(false); 
        alert("Availability updated successfully");
      } else {
        alert(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating availability");
    } finally {
      setUpdating(false);
    }
  };

  // --- SAFE IMAGE URL GENERATOR ---
  const getImageUrl = (filename) => {
    if (!filename) return "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop"; 
    
    if (filename.startsWith('http') || filename.startsWith('https')) return filename;
    
    // Safety check for PICTURE_BASE to prevent crash
    const base = typeof PICTURE_BASE === 'string' ? PICTURE_BASE : 'uploads';
    const cleanDir = base.replace(/^\/+|\/+$/g, '');
    
    return `/${cleanDir}/agent/${filename}`;
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
               <h1 className="text-xl font-serif font-bold text-brand-gold leading-none">Schedule Management</h1>
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

           {/* RIGHT CONTENT (Availability Grid) */}
           <div className="lg:col-span-8">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 h-full min-h-[500px] relative">
                 
                 {loadingAvail ? (
                    <div className="h-full flex flex-col items-center justify-center text-brand-muted">
                       <Loader2 className="animate-spin mb-2" size={32} />
                       <p>Loading schedule...</p>
                    </div>
                 ) : selectedId ? (
                    <>
                       <div className="flex justify-between items-start mb-8">
                          <div>
                             <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                                <Clock className="text-brand-gold" /> Weekly Availability
                             </h2>
                             <p className="text-brand-muted text-sm mt-1">
                                Click on the days below to mark them as available for bookings.
                             </p>
                          </div>
                          
                          {/* Update Button - Only shows when changes are made */}
                          {hasChanges && (
                             <button 
                               onClick={handleUpdate}
                               disabled={updating}
                               className="flex items-center gap-2 bg-brand-gold hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-xl transition-all shadow-lg animate-in fade-in slide-in-from-bottom-2"
                             >
                                {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                                Update Availability
                             </button>
                          )}
                       </div>

                       {/* DAYS GRID */}
                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {DAYS_MAP.map((day) => {
                             const isAvailable = availability[day.key] === true;
                             
                             return (
                                <button
                                   key={day.key}
                                   onClick={() => toggleDay(day.key)}
                                   className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 h-32 group ${
                                      isAvailable 
                                        ? 'bg-brand-gold text-black border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                                        : 'bg-[#121212] border-white/5 text-gray-500 hover:border-white/20 hover:bg-[#1a1a1a]'
                                   }`}
                                >
                                   <span className={`text-sm font-bold uppercase tracking-widest ${isAvailable ? 'text-black' : 'text-gray-400'}`}>
                                      {day.label}
                                   </span>
                                   
                                   {isAvailable ? (
                                      <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                                         <Check size={18} strokeWidth={3} />
                                      </div>
                                   ) : (
                                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                                         <Plus size={16} />
                                      </div>
                                   )}
                                   
                                   <span className="text-[10px] font-medium opacity-80">
                                      {isAvailable ? 'Available' : 'Unavailable'}
                                   </span>
                                </button>
                             );
                          })}
                       </div>

                       <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                          <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
                          <div className="text-sm text-blue-200/80">
                             <p className="font-semibold text-blue-400 mb-1">Note:</p>
                             Unchecked days will be marked as unavailable in the user booking system. Ensure you save changes after modifying the schedule.
                          </div>
                       </div>
                    </>
                 ) : (
                    <div className="h-full flex items-center justify-center text-brand-muted">
                       Select a celebrity to manage schedule
                    </div>
                 )}

              </div>
           </div>

        </div>
      </main>
    </div>
  );
};

export default AgentSchedulePage;