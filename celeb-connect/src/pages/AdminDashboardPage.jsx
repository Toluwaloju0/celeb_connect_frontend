import React, { useState, useEffect } from 'react';
import { 
  Search, Users, Star, UserCheck, Loader2, 
  Briefcase, Mail, Phone, Calendar, ShieldCheck, ChevronRight,
  Plus, X, Edit3, Trash2, Camera, LogOut, Upload, Image as ImageIcon,
  Award, MapPin, ChevronLeft, User, Crown, AlertTriangle, CheckCircle2, XCircle,
  Ticket, CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminDashboardPage = () => {
  const { user, adminLogout } = useAuth();
  
  // Navigation State
  const [activeSection, setActiveSection] = useState('agents'); 

  // --- AGENT STATE ---
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [activeAgentDetails, setActiveAgentDetails] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // --- CELEBRITY STATE ---
  const [celebrities, setCelebrities] = useState([]);
  const [celebPage, setCelebPage] = useState(1);
  const [celebLimit] = useState(9); 
  const [loadingCelebs, setLoadingCelebs] = useState(false);
  const [hasMoreCelebs, setHasMoreCelebs] = useState(true); 

  // --- USER STATE ---
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeUserDetails, setActiveUserDetails] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  
  const [userPage, setUserPage] = useState(1);
  const [userLimit] = useState(10); 
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  // --- BOOKING STATE ---
  const [bookingQuery, setBookingQuery] = useState('');
  const [searchedBooking, setSearchedBooking] = useState(null);
  const [searchingBooking, setSearchingBooking] = useState(false);
  const [updatingBooking, setUpdatingBooking] = useState(false);

  // --- ACTIONS STATE ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingAgent, setAddingAgent] = useState(false);
  const [newAgentData, setNewAgentData] = useState({ name: '', email: '', phone_number: '', tier: 1 });

  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '' });

  const [showTierModal, setShowTierModal] = useState(false);
  const [updatingTier, setUpdatingTier] = useState(false);
  const [selectedTier, setSelectedTier] = useState(1);

  const [showImageModal, setShowImageModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showUserLevelModal, setShowUserLevelModal] = useState(false);
  const [updatingUserLevel, setUpdatingUserLevel] = useState(false);
  const [selectedUserLevel, setSelectedUserLevel] = useState('Unverified');

  const [deleting, setDeleting] = useState(false);

  // Environment
  const PICTURE_BASE = import.meta.env.VITE_PICTURE_BASE;

  const AGENT_TIERS = [
    { value: 1, label: 'Junior' },
    { value: 2, label: 'Certified' },
    { value: 3, label: 'Senior' },
    { value: 4, label: 'Manager' },
    { value: 5, label: 'Owner' },
  ];

  const USER_LEVELS = [
    { value: 'Unverified', label: 'Unverified', icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { value: 'Verified', label: 'Verified', icon: UserCheck, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
    { value: 'Basic', label: 'Basic', icon: Star, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { value: 'Premium', label: 'Premium', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  // --- EFFECTS ---
  useEffect(() => {
    if (activeSection === 'agents') {
      fetchAgents();
    } else if (activeSection === 'celebrities') {
      fetchCelebrities();
    } else if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection, celebPage, userPage]); 

  // --- FETCH FUNCTIONS ---
  const fetchAgents = async () => {
    setLoadingList(true);
    try {
      const response = await api.get('/admin/agents');
      if (response.data.status === true && Array.isArray(response.data.data)) {
        setAgents(response.data.data);
        if (response.data.data.length > 0 && !selectedAgentId) {
          setSelectedAgentId(response.data.data[0].id);
        }
      } else {
        setAgents([]);
      }
    } catch (error) {
      console.error("Failed to fetch agents", error);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchCelebrities = async () => {
    setLoadingCelebs(true);
    try {
      const response = await api.get('/admin/celebs', { params: { page: celebPage, limit: celebLimit } });
      if (response.data.status === true && Array.isArray(response.data.data)) {
        setCelebrities(response.data.data);
        setHasMoreCelebs(response.data.data.length === celebLimit);
      } else {
        setCelebrities([]);
        setHasMoreCelebs(false);
      }
    } catch (error) {
      console.error("Failed to fetch celebrities", error);
    } finally {
      setLoadingCelebs(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get('/admin/users', { params: { page: userPage, limit: userLimit } });
      if (response.data.status === true && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
        setHasMoreUsers(response.data.data.length === userLimit);
        if (response.data.data.length > 0 && !selectedUserId) {
          setSelectedUserId(response.data.data[0].id);
        }
      } else {
        setUsers([]);
        setHasMoreUsers(false);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // --- DETAILS FETCHERS ---
  useEffect(() => {
    if (!selectedAgentId || activeSection !== 'agents') return;
    const fetchAgentDetails = async () => {
      setLoadingDetails(true);
      try {
        const response = await api.get(`/admin/agents/${selectedAgentId}`);
        if (response.data.status === true) {
          setActiveAgentDetails(response.data.data);
          setEditFormData({ name: response.data.data.name });
          setSelectedTier(response.data.data.tier || 1);
        }
      } catch (error) {
        console.error("Failed to fetch agent details", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchAgentDetails();
  }, [selectedAgentId, activeSection]);

  useEffect(() => {
    if (!selectedUserId || activeSection !== 'users') return;
    const fetchUserDetails = async () => {
        setLoadingUserDetails(true);
        try {
            const response = await api.get(`/admin/users/${selectedUserId}`);
            if (response.data.status === true) {
                setActiveUserDetails(response.data.data);
                setSelectedUserLevel(response.data.data.level || 'Unverified');
            }
        } catch (error) {
            console.error("Failed to fetch user details", error);
        } finally {
            setLoadingUserDetails(false);
        }
    };
    fetchUserDetails();
  }, [selectedUserId, activeSection]);

  // --- BOOKING HANDLERS ---
  const handleSearchBooking = async (e) => {
    e.preventDefault();
    if (!bookingQuery.trim()) return;

    setSearchingBooking(true);
    setSearchedBooking(null); 

    try {
      const response = await api.get(`/admin/bookings/${bookingQuery.trim()}`);
      
      if (response.data.status === true) {
        // Parse the new response structure
        const { booking, user: userName, celebrity: celebName } = response.data.data;
        
        // Flatten for easy use in UI
        setSearchedBooking({
            ...booking,
            user_name: userName,
            celeb_name: celebName,
            service_type: booking.type // Fallback mapping if UI uses service_type
        });
      } else {
        alert(response.data.message || "Booking not found");
      }
    } catch (error) {
      console.error("Search error", error);
      alert(error.response?.data?.message || "Booking not found or error occurred.");
    } finally {
      setSearchingBooking(false);
    }
  };

  const handleUpdateBookingStatus = async () => {
    if (!searchedBooking) return;
    setUpdatingBooking(true);
    try {
        const response = await api.patch(`/admin/bookings/${searchedBooking.id}`, { status: 'Paid' });
        
        if (response.data.status === true) {
            setSearchedBooking(prev => ({ ...prev, status: 'Paid' }));
            alert("Booking marked as Paid successfully.");
        } else {
            alert(response.data.message || "Update failed");
        }
    } catch (error) {
        alert(error.response?.data?.message || "Error updating booking status");
    } finally {
        setUpdatingBooking(false);
    }
  };

  // --- HANDLERS (Agent/User Actions) ---
  const handleAddAgent = async (e) => {
    e.preventDefault();
    setAddingAgent(true);
    try {
      const response = await api.post('/admin/agent/add', newAgentData);
      if (response.data.status === true) {
        const createdAgent = response.data.data;
        setAgents(prev => [...prev, createdAgent]);
        setSelectedAgentId(createdAgent.id);
        setNewAgentData({ name: '', email: '', phone_number: '', tier: 1 });
        setShowAddModal(false);
      } else {
        alert(response.data.message || "Failed to add agent");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error adding agent");
    } finally {
      setAddingAgent(false);
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!selectedAgentId) return;
    setUpdatingInfo(true);
    try {
      const response = await api.patch(`/admin/agent/${selectedAgentId}/profile/update`, editFormData);
      if (response.data.status === true) {
        const updatedName = editFormData.name;
        setActiveAgentDetails(prev => ({ ...prev, name: updatedName }));
        setAgents(prev => prev.map(a => a.id === selectedAgentId ? { ...a, name: updatedName } : a));
        setShowEditModal(false);
        alert("Agent information updated.");
      } else {
        alert(response.data.message || "Update failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error updating info");
    } finally {
      setUpdatingInfo(false);
    }
  };

  const handleUpdateTier = async (e) => {
    e.preventDefault();
    if (!selectedAgentId) return;
    setUpdatingTier(true);
    try {
      const response = await api.patch(`/admin/agent/${selectedAgentId}/profile/level`, { tier: parseInt(selectedTier) });
      if (response.data.status === true) {
        setActiveAgentDetails(prev => ({ ...prev, tier: parseInt(selectedTier) }));
        setShowTierModal(false);
        alert("Agent tier updated successfully.");
      } else {
        alert(response.data.message || "Update failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error updating tier");
    } finally {
      setUpdatingTier(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !selectedAgentId) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await api.put(`/admin/agent/${selectedAgentId}/profile/picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.status === true) {
        alert("Profile picture updated.");
        window.location.reload(); 
      } else {
        alert(response.data.message || "Upload failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error uploading image");
    } finally {
      setUploadingImage(false);
      setShowImageModal(false);
    }
  };

  const handleDeleteAgent = async () => {
    if (!selectedAgentId) return;
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    setDeleting(true);
    try {
      const response = await api.delete(`/admin/agent/${selectedAgentId}`);
      if (response.data.status === true) {
        const updatedList = agents.filter(a => a.id !== selectedAgentId);
        setAgents(updatedList);
        setSelectedAgentId(updatedList.length > 0 ? updatedList[0].id : null);
        setActiveAgentDetails(null);
        alert("Agent deleted.");
      } else {
        alert(response.data.message || "Delete failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting agent");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateUserLevel = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setUpdatingUserLevel(true);
    try {
      const response = await api.patch(`/admin/user/${selectedUserId}/profile/level`, { new_level: selectedUserLevel });
      if (response.data.status === true) {
        setActiveUserDetails(prev => ({ ...prev, level: selectedUserLevel }));
        setUsers(prev => prev.map(u => u.id === selectedUserId ? { ...u, level: selectedUserLevel } : u));
        setShowUserLevelModal(false);
        alert("User level updated.");
      } else {
        alert(response.data.message || "Update failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error updating user level");
    } finally {
      setUpdatingUserLevel(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    if (!window.confirm("Are you sure?")) return;
    setDeleting(true);
    try {
        const response = await api.delete(`/admin/user/${selectedUserId}`);
        if (response.data.status === true) {
            const updatedList = users.filter(u => u.id !== selectedUserId);
            setUsers(updatedList);
            setSelectedUserId(updatedList.length > 0 ? updatedList[0].id : null);
            setActiveUserDetails(null);
            alert("User deleted.");
        } else {
            alert(response.data.message || "Delete failed");
        }
    } catch (error) {
        alert(error.response?.data?.message || "Error deleting user");
    } finally {
        setDeleting(false);
    }
  };

  // --- HELPERS ---
  const getAgentImageUrl = (filename) => {
    if (!filename) return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop";
    if (filename.startsWith('http')) return filename;
    const cleanDir = PICTURE_BASE.replace(/^\/+|\/+$/g, '');
    return `/${cleanDir}/agent/${filename}`; 
  };

  const getCelebImageUrl = (filename) => {
    if (!filename) return "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop";
    if (filename.startsWith('http')) return filename;
    const cleanDir = PICTURE_BASE.replace(/^\/+|\/+$/g, '');
    return `/${cleanDir}/agent/${filename}`; 
  };

  const getUserImageUrl = (filename) => {
    if (!filename) return "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop";
    if (filename.startsWith('http')) return filename;
    const cleanDir = PICTURE_BASE.replace(/^\/+|\/+$/g, '');
    return `/${cleanDir}/user/${filename}`;
  };

  const getTierLabel = (val) => AGENT_TIERS.find(t => t.value === val)?.label || 'Unknown';
  const getUserLevelInfo = (levelStr) => USER_LEVELS.find(l => l.value === levelStr) || USER_LEVELS[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-bold text-red-500 leading-none">CelebConnect</h1>
            <p className="text-[10px] text-brand-muted uppercase tracking-wider">Admin Panel</p>
          </div>
          <button onClick={adminLogout} className="flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-red-500 transition-colors">
             <LogOut size={18} /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
             <h1 className="text-3xl font-serif text-white font-bold mb-1">Admin Dashboard</h1>
             <p className="text-brand-muted text-sm">Manage platform resources, agents, and user base.</p>
           </div>
           
           {activeSection === 'agents' && (
             <button onClick={() => setShowAddModal(true)} className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-900/20">
                <Plus size={20} /> Add New Agent
             </button>
           )}
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-4 mb-8">
           <NavCard title="Agents" icon={<Briefcase />} active={activeSection === 'agents'} onClick={() => setActiveSection('agents')} count={agents.length > 0 ? agents.length : '--'} />
           <NavCard title="Celebrities" icon={<Star />} active={activeSection === 'celebrities'} onClick={() => setActiveSection('celebrities')} count={celebrities.length > 0 ? celebrities.length : '--'} />
           <NavCard title="Users" icon={<Users />} active={activeSection === 'users'} onClick={() => setActiveSection('users')} count={users.length > 0 ? users.length : '--'} />
           <NavCard title="Bookings" icon={<Ticket />} active={activeSection === 'bookings'} onClick={() => setActiveSection('bookings')} />
        </div>

        {/* --- SECTION: AGENTS --- */}
        {activeSection === 'agents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             {/* Agents List & Details (Same as before) */}
             <div className="lg:col-span-4 space-y-4">
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                   <input type="text" placeholder="Search agents..." className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                </div>
                <div className="space-y-3 mt-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                   {loadingList ? (
                      <div className="flex justify-center py-8"><Loader2 className="animate-spin text-red-500" /></div>
                   ) : agents.length === 0 ? (
                      <div className="text-center py-8 text-brand-muted text-sm">No agents found.</div>
                   ) : (
                      agents.map((agent) => (
                        <div key={agent.id} onClick={() => setSelectedAgentId(agent.id)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${selectedAgentId === agent.id ? 'bg-[#1a1a1a] border-red-500/30 shadow-lg shadow-black/20' : 'bg-[#1a1a1a]/50 border-white/5 hover:border-white/10'}`}>
                           <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 bg-gray-800"><img src={getAgentImageUrl(agent.profile_url)} alt={agent.name} className="w-full h-full object-cover" /></div>
                           <div className="flex-1 min-w-0"><h4 className={`font-medium text-sm truncate ${selectedAgentId === agent.id ? 'text-red-500' : 'text-white'}`}>{agent.name}</h4><p className="text-xs text-brand-muted truncate">{agent.email}</p></div>
                           <ChevronRight size={16} className={`text-gray-600 ${selectedAgentId === agent.id ? 'text-red-500' : ''}`} />
                        </div>
                      ))
                   )}
                </div>
             </div>
             <div className="lg:col-span-8">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 h-full min-h-[500px] relative">
                   {loadingDetails ? (
                      <div className="h-full flex flex-col items-center justify-center text-brand-muted"><Loader2 className="animate-spin mb-2" size={32} /><p>Loading details...</p></div>
                   ) : activeAgentDetails ? (
                      <>
                         <div className="absolute top-8 right-8 flex gap-3">
                            <button onClick={() => setShowEditModal(true)} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 transition-colors"><Edit3 size={16} /> Edit Info</button>
                            <button onClick={handleDeleteAgent} disabled={deleting} className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-500 rounded-lg text-sm hover:bg-red-500/10 transition-colors">{deleting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />} Delete</button>
                         </div>
                         <div className="flex items-start gap-6 mb-8 border-b border-white/5 pb-8 pr-32">
                            <div className="relative group">
                               <div className="w-24 h-24 rounded-full border-2 border-red-500/20 overflow-hidden bg-gray-900"><img src={getAgentImageUrl(activeAgentDetails.profile_url)} alt={activeAgentDetails.name} className="w-full h-full object-cover" /></div>
                               <button onClick={() => { setSelectedFile(null); setImagePreview(null); setShowImageModal(true); }} className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-500 transition-colors"><Camera size={14} /></button>
                            </div>
                            <div className="flex-1 pt-2">
                               <h2 className="text-3xl font-serif text-white mb-2">{activeAgentDetails.name}</h2>
                               <div className="flex gap-2 items-center">
                                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase group cursor-pointer hover:bg-blue-500/20 transition-colors">
                                     <span>Tier {activeAgentDetails.tier || 1} ({getTierLabel(activeAgentDetails.tier)})</span>
                                     <button onClick={() => { setSelectedTier(activeAgentDetails.tier); setShowTierModal(true); }} className="ml-1 p-0.5 rounded-full hover:bg-blue-500 hover:text-white text-blue-400 transition-colors"><Edit3 size={10} /></button>
                                  </div>
                                  {activeAgentDetails.email_verified ? (<span className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold uppercase flex items-center gap-1"><UserCheck size={12} /> Verified</span>) : (<span className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase">Pending Verification</span>)}
                               </div>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem icon={<Mail size={18} />} label="Email Address" value={activeAgentDetails.email} />
                            <DetailItem icon={<Phone size={18} />} label="Phone Number" value={activeAgentDetails.phone_number || 'N/A'} />
                            <DetailItem icon={<Calendar size={18} />} label="Date Joined" value={new Date(activeAgentDetails.created_at).toLocaleDateString()} />
                            <DetailItem icon={<ShieldCheck size={18} />} label="Admin Ref ID" value={activeAgentDetails.admin_id?.substring(0, 8) || 'N/A'} />
                         </div>
                      </>
                   ) : (<div className="h-full flex items-center justify-center text-brand-muted">Select an agent to view details</div>)}
                </div>
             </div>
          </div>
        )}

        {/* --- SECTION: CELEBRITIES --- */}
        {activeSection === 'celebrities' && (
          <div className="space-y-6">
             <div className="min-h-[400px]">
                {loadingCelebs ? (
                   <div className="flex flex-col items-center justify-center h-64 text-red-500"><Loader2 className="animate-spin mb-2" size={32} /><p className="text-brand-muted text-sm">Loading Roster...</p></div>
                ) : celebrities.length === 0 ? (
                   <div className="text-center py-20 bg-[#1a1a1a] border border-white/5 rounded-3xl"><Star size={48} className="mx-auto text-brand-muted mb-4 opacity-20" /><p className="text-brand-muted">No celebrities found.</p></div>
                ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {celebrities.map((celeb) => (
                         <div key={celeb.id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all group">
                            <div className="h-24 bg-gradient-to-r from-red-900/20 to-black relative">
                               <div className="absolute top-4 right-4"><span className="px-2 py-1 rounded bg-black/50 border border-white/10 text-brand-muted text-[10px] backdrop-blur-md">Ref: {celeb.id.substring(0,6)}</span></div>
                            </div>
                            <div className="px-6 pb-6 -mt-12 relative">
                               <div className="w-24 h-24 rounded-full border-4 border-[#1a1a1a] overflow-hidden bg-gray-800 shadow-lg"><img src={getCelebImageUrl(celeb.profile_url)} alt={celeb.name} className="w-full h-full object-cover" /></div>
                               <div className="mt-4">
                                  <h3 className="text-xl font-serif text-white font-bold">{celeb.name}</h3>
                                  <p className="text-red-400 text-sm font-medium flex items-center gap-1 mb-3"><Briefcase size={12} /> {celeb.profession || 'Unknown'}</p>
                                  <div className="space-y-2 text-xs text-brand-muted bg-black/20 p-3 rounded-lg border border-white/5">
                                     <div className="flex items-center justify-between"><span className="flex items-center gap-1"><MapPin size={10} /> Location</span><span className="text-gray-300">{celeb.location || 'N/A'}</span></div>
                                     <div className="flex items-center justify-between"><span className="flex items-center gap-1"><UserCheck size={10} /> Agent ID</span><span className="text-gray-300 font-mono">{celeb.agent_id ? celeb.agent_id.substring(0,8) : 'Unassigned'}</span></div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
             <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button onClick={() => setCelebPage(prev => Math.max(prev - 1, 1))} disabled={celebPage === 1} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 disabled:opacity-50"><ChevronLeft size={16} /> Previous</button>
                <span className="text-sm text-brand-muted">Page {celebPage}</span>
                <button onClick={() => setCelebPage(prev => prev + 1)} disabled={!hasMoreCelebs} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 disabled:opacity-50">Next <ChevronRight size={16} /></button>
             </div>
          </div>
        )}

        {/* --- SECTION: USERS --- */}
        {activeSection === 'users' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-4">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" placeholder="Search users..." className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                 </div>
                 <div className="space-y-3 mt-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                    {loadingUsers ? (
                       <div className="flex justify-center py-8"><Loader2 className="animate-spin text-red-500" /></div>
                    ) : users.length === 0 ? (
                       <div className="text-center py-8 text-brand-muted text-sm">No users found.</div>
                    ) : (
                       users.map((userItem) => (
                         <div key={userItem.id} onClick={() => setSelectedUserId(userItem.id)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${selectedUserId === userItem.id ? 'bg-[#1a1a1a] border-red-500/30 shadow-lg shadow-black/20' : 'bg-[#1a1a1a]/50 border-white/5 hover:border-white/10'}`}>
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 bg-gray-800"><img src={getUserImageUrl(userItem.profile_url)} alt={userItem.name} className="w-full h-full object-cover" /></div>
                            <div className="flex-1 min-w-0">
                               <h4 className={`font-medium text-sm truncate ${selectedUserId === userItem.id ? 'text-red-500' : 'text-white'}`}>{userItem.name || 'User'}</h4>
                               <p className="text-xs text-brand-muted truncate">{userItem.email}</p>
                            </div>
                            <ChevronRight size={16} className={`text-gray-600 ${selectedUserId === userItem.id ? 'text-red-500' : ''}`} />
                         </div>
                       ))
                    )}
                 </div>
                 <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <button onClick={() => setUserPage(prev => Math.max(prev - 1, 1))} disabled={userPage === 1} className="flex items-center gap-1 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white hover:bg-white/5 disabled:opacity-50"><ChevronLeft size={12} /> Prev</button>
                    <span className="text-xs text-brand-muted">Page {userPage}</span>
                    <button onClick={() => setUserPage(prev => prev + 1)} disabled={!hasMoreUsers} className="flex items-center gap-1 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white hover:bg-white/5 disabled:opacity-50">Next <ChevronRight size={12} /></button>
                 </div>
              </div>
              <div className="lg:col-span-8">
                 <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 h-full min-h-[500px] relative">
                    {loadingUserDetails ? (
                       <div className="h-full flex flex-col items-center justify-center text-brand-muted"><Loader2 className="animate-spin mb-2" size={32} /><p>Loading details...</p></div>
                    ) : activeUserDetails ? (
                       <>
                          <div className="absolute top-8 right-8">
                             <button onClick={handleDeleteUser} disabled={deleting} className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-500 rounded-lg text-sm hover:bg-red-500/10 transition-colors">{deleting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />} Delete User</button>
                          </div>
                          <div className="flex items-start gap-6 mb-8 border-b border-white/5 pb-8">
                             <div className="w-24 h-24 rounded-full border-2 border-red-500/20 overflow-hidden bg-gray-900"><img src={getUserImageUrl(activeUserDetails.profile_url)} alt={activeUserDetails.name} className="w-full h-full object-cover" /></div>
                             <div className="flex-1 pt-2">
                                <h2 className="text-3xl font-serif text-white mb-2">{activeUserDetails.name || 'Unknown User'}</h2>
                                <div className="flex gap-2 flex-wrap">
                                   <div className={`px-2 py-1 rounded border text-xs font-bold uppercase flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${getUserLevelInfo(activeUserDetails.level).bg} ${getUserLevelInfo(activeUserDetails.level).color}`}>
                                      {React.createElement(getUserLevelInfo(activeUserDetails.level).icon, { size: 12 })}
                                      <span>{getUserLevelInfo(activeUserDetails.level).label}</span>
                                      <button onClick={() => { setSelectedUserLevel(activeUserDetails.level); setShowUserLevelModal(true); }} className="ml-1 p-0.5 rounded-full hover:bg-white/20 text-current transition-colors"><Edit3 size={10} /></button>
                                   </div>
                                   {activeUserDetails.is_verified ? (<span className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold uppercase flex items-center gap-1"><CheckCircle2 size={12} /> Verified</span>) : (<span className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase flex items-center gap-1"><XCircle size={12} /> Not Verified</span>)}
                                </div>
                             </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <DetailItem icon={<Mail size={18} />} label="Email Address" value={activeUserDetails.email} />
                             <DetailItem icon={<Phone size={18} />} label="Phone Number" value={activeUserDetails.phone_number || 'N/A'} />
                             <DetailItem icon={<Calendar size={18} />} label="Date Joined" value={new Date(activeUserDetails.created_at).toLocaleDateString()} />
                             <DetailItem icon={<ShieldCheck size={18} />} label="User ID" value={activeUserDetails.id} />
                          </div>
                       </>
                    ) : (<div className="h-full flex items-center justify-center text-brand-muted">Select a user to view details</div>)}
                 </div>
              </div>
           </div>
        )}

        {/* --- SECTION: BOOKINGS (UPDATED) --- */}
        {activeSection === 'bookings' && (
           <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl p-8">
                 <h2 className="text-2xl font-serif text-white mb-4 text-center">Search Booking</h2>
                 <p className="text-brand-muted text-sm text-center mb-6">Enter a valid Booking ID to view details. Admin cannot browse all bookings due to privacy restrictions.</p>
                 
                 <form onSubmit={handleSearchBooking} className="flex gap-2 mb-8">
                    <input 
                      type="text" 
                      placeholder="Enter Booking ID (e.g. 550e8400...)" 
                      value={bookingQuery}
                      onChange={(e) => setBookingQuery(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500/50 outline-none"
                    />
                    <button 
                      type="submit" 
                      disabled={searchingBooking || !bookingQuery.trim()}
                      className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold px-6 rounded-xl transition-colors flex items-center justify-center"
                    >
                       {searchingBooking ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                    </button>
                 </form>

                 {searchedBooking && (
                    <div className="bg-[#121212] border border-white/5 rounded-xl p-6 animate-in fade-in zoom-in-95">
                       <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                          <div>
                             <h3 className="text-white font-bold text-lg">Booking Details</h3>
                             <p className="text-xs text-brand-muted font-mono">{searchedBooking.id}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                             searchedBooking.status === 'Paid' ? 'text-green-500 border-green-500/30' : 
                             searchedBooking.status === 'Pending' ? 'text-yellow-500 border-yellow-500/30' :
                             'text-red-500 border-red-500/30'
                          }`}>
                             {searchedBooking.status}
                          </span>
                       </div>
                       
                       <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                             <span className="text-gray-400">Celebrity</span>
                             <span className="text-white font-medium">{searchedBooking.celeb_name}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                             <span className="text-gray-400">User</span>
                             <span className="text-white font-medium">{searchedBooking.user_name}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                             <span className="text-gray-400">Service</span>
                             <span className="text-white font-medium">{searchedBooking.service_type}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                             <span className="text-gray-400">Date</span>
                             <span className="text-white font-medium">{new Date(searchedBooking.created_at).toLocaleDateString()}</span>
                          </div>
                       </div>

                       {/* MARK AS PAID BUTTON */}
                       {searchedBooking.status === 'Pending' && (
                          <div className="mt-6 pt-4 border-t border-white/10">
                             <button 
                               onClick={handleUpdateBookingStatus}
                               disabled={updatingBooking}
                               className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                             >
                                {updatingBooking ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                                Mark as Paid
                             </button>
                          </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
        )}

      </main>

      {/* --- ALL MODALS --- */}
      {/* ... (Previous modals remain identical: Add Agent, Edit Info, Tier, Image, User Level) ... */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-brand-muted hover:text-white"><X size={20} /></button>
              <h2 className="text-2xl font-serif text-white mb-6 text-red-500">Add New Agent</h2>
              <form onSubmit={handleAddAgent} className="space-y-4">
                 <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">Full Name</label><input required value={newAgentData.name} onChange={e => setNewAgentData({...newAgentData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500/50 outline-none" /></div>
                 <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">Email Address</label><input required type="email" value={newAgentData.email} onChange={e => setNewAgentData({...newAgentData, email: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500/50 outline-none" /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">Phone</label><input required type="tel" value={newAgentData.phone_number} onChange={e => setNewAgentData({...newAgentData, phone_number: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500/50 outline-none" /></div>
                    <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">Tier</label><select value={newAgentData.tier} onChange={e => setNewAgentData({...newAgentData, tier: parseInt(e.target.value)})} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500/50 outline-none"><option value={1}>Tier 1</option><option value={2}>Tier 2</option><option value={3}>Tier 3</option></select></div>
                 </div>
                 <div className="pt-4"><button type="submit" disabled={addingAgent} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">{addingAgent ? <Loader2 className="animate-spin" /> : 'Create Agent Account'}</button></div>
              </form>
           </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
              <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-brand-muted hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-serif text-white mb-4">Update Information</h2>
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                 <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">Agent Name</label><input required value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500/50 outline-none" /></div>
                 <button type="submit" disabled={updatingInfo} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">{updatingInfo ? <Loader2 className="animate-spin" /> : 'Save Changes'}</button>
              </form>
           </div>
        </div>
      )}
      {showTierModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
              <button onClick={() => setShowTierModal(false)} className="absolute top-4 right-4 text-brand-muted hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-serif text-white mb-4">Change Agent Tier</h2>
              <form onSubmit={handleUpdateTier} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400">Select Tier</label>
                    <select value={selectedTier} onChange={e => setSelectedTier(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500/50 outline-none">
                       {AGENT_TIERS.map(t => <option key={t.value} value={t.value}>{t.value} - {t.label}</option>)}
                    </select>
                 </div>
                 <button type="submit" disabled={updatingTier} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">{updatingTier ? <Loader2 className="animate-spin" /> : 'Update Tier'}</button>
              </form>
           </div>
        </div>
      )}
      {showImageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
              <button onClick={() => setShowImageModal(false)} className="absolute top-4 right-4 text-brand-muted hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-serif text-white mb-4">Update Profile Picture</h2>
              <div className="space-y-6 text-center">
                 <div className="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-black/20">{imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="text-brand-muted flex flex-col items-center"><ImageIcon size={24} /><span className="text-xs mt-2">No file</span></div>}</div>
                 <div className="relative"><input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="admin-file-upload" /><label htmlFor="admin-file-upload" className="inline-block cursor-pointer px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white text-sm rounded-lg border border-white/10">Select Image</label></div>
                 <button onClick={handleImageUpload} disabled={!selectedFile || uploadingImage} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">{uploadingImage ? <Loader2 className="animate-spin" /> : 'Upload'}</button>
              </div>
           </div>
        </div>
      )}
      {showUserLevelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
              <button onClick={() => setShowUserLevelModal(false)} className="absolute top-4 right-4 text-brand-muted hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-serif text-white mb-4">Change User Level</h2>
              <p className="text-brand-muted text-sm mb-4">Update the verification status and access level for this user.</p>
              <form onSubmit={handleUpdateUserLevel} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400">Select Level</label>
                    <select value={selectedUserLevel} onChange={e => setSelectedUserLevel(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500/50 outline-none">
                       {USER_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                 </div>
                 <button type="submit" disabled={updatingUserLevel} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">{updatingUserLevel ? <Loader2 className="animate-spin" /> : 'Update Level'}</button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

// Sub Components
const NavCard = ({ title, icon, active, onClick, count }) => (
   <div onClick={onClick} className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${active ? 'bg-[#1a1a1a] border-red-500 text-white shadow-lg shadow-red-900/10' : 'bg-[#1a1a1a]/40 border-white/5 text-gray-500 hover:bg-[#1a1a1a] hover:border-white/20 hover:text-gray-300'}`}>
      <div className={`${active ? 'text-red-500' : 'text-current'}`}>{icon}</div>
      <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
      {count && <span className="text-xs opacity-50">{count} Records</span>}
   </div>
);

const DetailItem = ({ icon, label, value }) => (
   <div className="bg-[#121212] border border-white/5 p-4 rounded-xl flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-red-500 border border-white/5">{icon}</div>
      <div><p className="text-[10px] text-brand-muted uppercase font-bold">{label}</p><p className="text-white text-sm break-all">{value}</p></div>
   </div>
);

export default AdminDashboardPage;