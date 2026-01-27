import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Calendar, Edit3, User, CheckCircle2, 
  ChevronDown, Users, Loader2, X, MapPin, Briefcase, Heart,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AgentDashboardPage = () => {
  const { user, agentLogout } = useAuth();
  const [activeTab, setActiveTab] = useState('roster');
  
  // ... (State variables remain the same) ...
  const [celebrities, setCelebrities] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeCelebDetails, setActiveCelebDetails] = useState(null);
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [addingCeleb, setAddingCeleb] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '', location: '', profession: '', marital_status: ''
  });

  const PICTURE_BASE = import.meta.env.VITE_PICTURE_BASE;

  // ... (useEffect and API functions remain the same) ...
  useEffect(() => { fetchRoster(); }, []);

  const fetchRoster = async () => {
    setLoadingRoster(true);
    try {
      const response = await api.get('/agent/celebs');
      if (response.data.status === true && Array.isArray(response.data.data)) {
        setCelebrities(response.data.data);
        if (response.data.data.length > 0 && !selectedId) {
          setSelectedId(response.data.data[0].id);
        }
      } else {
        setCelebrities([]);
      }
    } catch (error) {
      console.error("Failed to fetch roster", error);
    } finally {
      setLoadingRoster(false);
    }
  };

  useEffect(() => {
    if (!selectedId) return;
    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const response = await api.get(`/agent/celebs/${selectedId}`);
        if (response.data.status === true) {
          setActiveCelebDetails(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [selectedId]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddingCeleb(true);
    try {
      const response = await api.put('/agent/celeb/add', addFormData);
      if (response.data.status === true) {
        const newCeleb = response.data.data;
        setCelebrities(prev => [...prev, newCeleb]);
        setSelectedId(newCeleb.id);
        setAddFormData({ name: '', location: '', profession: '', marital_status: '' });
        setShowAddModal(false);
      } else {
        alert(response.data.message || "Failed to add celebrity");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding celebrity");
    } finally {
      setAddingCeleb(false);
    }
  };

  const getImageUrl = (filename) => {
    if (!filename) return "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop"; 
    if (filename.startsWith('http') || filename.startsWith('https')) return filename;
    const cleanDir = PICTURE_BASE.replace(/^\/+|\/+$/g, '');
    return `/${cleanDir}/agent/${filename}`;
  };

  // --- EXPLICIT LOGOUT HANDLER ---
  const handleLogoutClick = (e) => {
    e.preventDefault(); // Stop any form submission bubbling
    console.log("Logout Clicked"); // Debugging
    if (agentLogout) {
      agentLogout();
    } else {
      console.error("agentLogout function not found in context");
      // Fallback
      localStorage.removeItem('user');
      window.location.href = '/agent/login';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
               <h1 className="text-xl font-serif font-bold text-brand-gold leading-none">CelebConnect</h1>
               <p className="text-[10px] text-brand-muted uppercase tracking-wider">Agent Portal</p>
            </div>
          </div>
          
          {/* LOGOUT BUTTON */}
          {/* Added type="button" and explicit handler */}
          <button 
            type="button"
            onClick={handleLogoutClick}
            className="flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-red-500 transition-colors z-50 cursor-pointer"
          >
             <LogOut size={18} /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ... Rest of the Main content remains exactly the same as previous step ... */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
              <h1 className="text-3xl font-serif text-white font-bold mb-1">Agent Dashboard</h1>
              <p className="text-brand-muted text-sm">Manage your celebrity roster and availability schedules</p>
           </div>
           <button onClick={() => setShowAddModal(true)} className="bg-brand-gold hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-brand-gold/10">
              <Plus size={20} /> Add New Celebrity
           </button>
        </div>

        <div className="flex items-center gap-8 border-b border-white/10 mb-8">
           <TabItem label="Celebrity Roster" icon={<Users size={18} />} active={activeTab === 'roster'} onClick={() => setActiveTab('roster')} />
           <TabItem label="Schedule Management" icon={<Calendar size={18} />} active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-4 space-y-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                 <input type="text" placeholder="Search roster..." className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-colors" />
              </div>
              <div className="space-y-2">
                 <DropdownFilter label="All Status" />
              </div>
              <div className="space-y-3 mt-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                 {loadingRoster ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-brand-gold" /></div>
                 ) : celebrities.length === 0 ? (
                    <div className="text-center py-8 text-brand-muted text-sm">No celebrities found. Add one to get started.</div>
                 ) : (
                    celebrities.map((celeb) => (
                      <div key={celeb.id} onClick={() => setSelectedId(celeb.id)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${selectedId === celeb.id ? 'bg-[#1a1a1a] border-brand-gold/30 shadow-lg shadow-black/20' : 'bg-[#1a1a1a]/50 border-white/5 hover:border-white/10'}`}>
                         <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0 bg-gray-800">
                            <img src={getImageUrl(celeb.profile_url)} alt={celeb.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                               <h4 className={`font-serif font-bold truncate ${selectedId === celeb.id ? 'text-brand-gold' : 'text-white'}`}>{celeb.name}</h4>
                               {selectedId === celeb.id && <CheckCircle2 size={14} className="text-brand-gold shrink-0" />}
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] text-gray-400"><span>{celeb.profession || 'Artist'}</span></div>
                         </div>
                      </div>
                    ))
                 )}
              </div>
           </div>

           <div className="lg:col-span-8">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 h-full min-h-[500px]">
                 {loadingDetails ? (
                    <div className="h-full flex flex-col items-center justify-center text-brand-muted"><Loader2 className="animate-spin mb-2" size={32} /><p>Loading details...</p></div>
                 ) : activeCelebDetails ? (
                    <>
                       <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                          <div className="flex items-center gap-4">
                             <div className="w-20 h-20 rounded-full border-2 border-brand-gold/20 overflow-hidden">
                                <img src={getImageUrl(activeCelebDetails.profile_url)} alt={activeCelebDetails.name} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <h2 className="text-3xl font-serif text-white flex items-center gap-2 mb-1">
                                   {activeCelebDetails.name} <CheckCircle2 className="text-brand-gold fill-brand-gold/10" size={24} />
                                </h2>
                                <p className="text-brand-muted text-sm">ID: {activeCelebDetails.id?.substring(0,8)}...</p>
                             </div>
                          </div>
                          <div className="flex gap-3">
                             <Link to={`/agent/celeb/edit/${activeCelebDetails.id}`} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 transition-colors">
                                <Edit3 size={16} /> Edit Profile
                             </Link>
                             <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 transition-colors">
                                <Calendar size={16} /> Set Availability
                             </button>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                          <DetailBox icon={<Briefcase size={16} />} label="Profession" value={activeCelebDetails.profession || "Not Set"} />
                          <DetailBox icon={<MapPin size={16} />} label="Location" value={activeCelebDetails.location || "Not Set"} />
                          <DetailBox icon={<Heart size={16} />} label="Marital Status" value={activeCelebDetails.marital_status || "Not Set"} />
                       </div>
                       <div className="mb-8 p-4 bg-[#121212] rounded-xl border border-white/5">
                          <h3 className="text-sm font-bold text-white mb-2">Biography</h3>
                          <p className="text-brand-muted text-sm leading-relaxed">{activeCelebDetails.bio || "Bio not yet added."}</p>
                       </div>
                       <div className="flex justify-between items-center pt-6 border-t border-white/10">
                          <div><p className="text-sm font-bold text-white mb-0.5">Current Status</p><p className="text-xs text-brand-muted">Availability and booking status</p></div>
                          <div className="text-right"><span className="text-green-500 font-bold text-sm block">Active</span></div>
                       </div>
                    </>
                 ) : (
                    <div className="h-full flex items-center justify-center text-brand-muted">Select a celebrity to view details</div>
                 )}
              </div>
           </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-brand-muted hover:text-white"><X size={20} /></button>
              <h2 className="text-2xl font-serif text-white mb-6">Add New Celebrity</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                 <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">Full Name</label><input required value={addFormData.name} onChange={e => setAddFormData({...addFormData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 outline-none" /></div>
                 <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">Profession</label><input required value={addFormData.profession} onChange={e => setAddFormData({...addFormData, profession: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 outline-none" /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">Location</label><input required value={addFormData.location} onChange={e => setAddFormData({...addFormData, location: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 outline-none" /></div>
                    <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">Marital Status</label><select value={addFormData.marital_status} onChange={e => setAddFormData({...addFormData, marital_status: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 outline-none"><option value="">Select...</option><option value="Single">Single</option><option value="Married">Married</option><option value="Divorced">Divorced</option><option value="Relationship">In a Relationship</option></select></div>
                 </div>
                 <div className="pt-4"><button type="submit" disabled={addingCeleb} className="w-full bg-brand-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">{addingCeleb ? <Loader2 className="animate-spin" /> : 'Create Celebrity'}</button></div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

// Sub Components... (Same as before)
const TabItem = ({ label, icon, active, onClick }) => (<button onClick={onClick} className={`flex items-center gap-2 pb-4 text-sm font-medium transition-all relative ${active ? 'text-brand-gold' : 'text-brand-muted hover:text-white'}`}>{icon} {label}{active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold rounded-t-full"></span>}</button>);
const DropdownFilter = ({ label }) => (<button className="w-full flex justify-between items-center bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white hover:border-white/20 transition-colors"><span>{label}</span><ChevronDown size={16} className="text-gray-500" /></button>);
const DetailBox = ({ icon, label, value }) => (<div className="bg-[#121212] border border-white/5 p-4 rounded-xl flex items-center gap-3"><div className="text-brand-gold">{icon}</div><div><p className="text-[10px] text-brand-muted uppercase">{label}</p><p className="text-white font-medium text-sm">{value}</p></div></div>);

export default AgentDashboardPage;