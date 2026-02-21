import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Upload, User, Briefcase, MapPin, Heart, 
  Loader2, X, Image as ImageIcon, AlignLeft 
} from 'lucide-react';
import api from '../api/axios';

const AgentEditCelebrityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data States
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    location: '',
    marital_status: '',
    bio: '' 
  });
  const [currentImage, setCurrentImage] = useState(null);
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Modal State for Image Upload
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const PICTURE_BASE = import.meta.env.VITE_PICTURE_BASE;

  // 1. Fetch Details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/agent/celebs/${id}`);
        if (response.data.status === true) {
          const data = response.data.data;
          setFormData({
            name: data.name || '',
            profession: data.profession || '',
            location: data.location || '',
            marital_status: data.marital_status || '',
            bio: data.bio || '' 
          });
          setCurrentImage(data.profile_url);
        } else {
          alert('Celebrity not found');
          navigate('/agent/dashboard');
        }
      } catch (error) {
        console.error("Failed to fetch details", error);
        navigate('/agent/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  // 2. Handle Text Update (UPDATED ENDPOINT)
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // UPDATED: /agent/celeb/{id}/profile
      const response = await api.patch(`/agent/celeb/${id}/profile`, formData);
      
      if (response.data.status === true) {
        alert('Profile updated successfully');
        navigate('/agent/dashboard');
      } else {
        alert(response.data.message || 'Update failed');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  // 3. Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 4. Handle Image Upload
  const handleImageUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    const data = new FormData();
    data.append('file', selectedFile); 

    try {
      const response = await api.put(`/agent/celeb/${id}/profile/picture`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.status === true) {
        alert('Image updated successfully');
        window.location.reload(); 
      } else {
        alert(response.data.message || 'Image upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
      setShowImageModal(false);
    }
  };

  const getImageUrl = (filename) => {
    if (!filename) return "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop"; 
    if (filename.startsWith('http') || filename.startsWith('https')) return filename;
    
    const cleanDir = PICTURE_BASE ? PICTURE_BASE.replace(/^\/+|\/+$/g, '') : 'uploads';
    return `/${cleanDir}/agent/${filename}`;
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      
      {/* Navbar Simple */}
      <nav className="border-b border-white/10 bg-[#121212]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/agent/dashboard')} className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
             </button>
             <h1 className="text-lg font-serif font-bold text-white">Edit Celebrity Profile</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: Image Section */}
          <div className="col-span-1">
             <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-brand-gold/20 mb-4 bg-gray-800 relative group">
                   <img src={getImageUrl(currentImage)} alt="Profile" className="w-full h-full object-cover" />
                </div>
                
                <h2 className="text-xl font-serif text-white font-bold mb-1">{formData.name || 'Name'}</h2>
                <p className="text-xs text-brand-muted mb-6">ID: {id?.substring(0,8)}</p>

                <button 
                  onClick={() => setShowImageModal(true)}
                  className="w-full py-2 border border-brand-gold/30 text-brand-gold rounded-lg text-sm font-medium hover:bg-brand-gold hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                   <Upload size={16} /> Change Photo
                </button>
             </div>
          </div>

          {/* Right: Form Section */}
          <div className="col-span-2">
             <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Basic Information</h3>
                
                <form onSubmit={handleSave} className="space-y-6">
                   
                   <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 flex items-center gap-1"><User size={12}/> Full Name</label>
                      <input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 outline-none"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400 flex items-center gap-1"><Briefcase size={12}/> Profession</label>
                          <input 
                            required
                            value={formData.profession}
                            onChange={e => setFormData({...formData, profession: e.target.value})}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 outline-none"
                          />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400 flex items-center gap-1"><MapPin size={12}/> Location</label>
                          <input 
                            required
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 outline-none"
                          />
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 flex items-center gap-1"><Heart size={12}/> Marital Status</label>
                      <select 
                        value={formData.marital_status}
                        onChange={e => setFormData({...formData, marital_status: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 outline-none"
                      >
                          <option value="">Select...</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Relationship">In a Relationship</option>
                       </select>
                   </div>

                   {/* BIO FIELD */}
                   <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 flex items-center gap-1"><AlignLeft size={12}/> Biography</label>
                      <textarea
                        value={formData.bio}
                        onChange={e => setFormData({...formData, bio: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 outline-none min-h-[120px] resize-y custom-scrollbar"
                        placeholder="Write a short biography about the celebrity..."
                      />
                   </div>

                   <div className="pt-6 border-t border-white/5 flex justify-end">
                      <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-brand-gold hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2"
                      >
                         {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                      </button>
                   </div>

                </form>
             </div>
          </div>

        </div>
      </main>

      {/* --- IMAGE UPLOAD MODAL --- */}
      {showImageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
              <button 
                onClick={() => { setShowImageModal(false); setImagePreview(null); setSelectedFile(null); }} 
                className="absolute top-4 right-4 text-brand-muted hover:text-white"
              >
                 <X size={20} />
              </button>

              <h2 className="text-xl font-serif text-white mb-6">Update Profile Picture</h2>
              
              <div className="space-y-6 text-center">
                 <div className="w-40 h-40 mx-auto rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-black/20 relative">
                    {imagePreview ? (
                       <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                       <div className="text-brand-muted flex flex-col items-center">
                          <ImageIcon size={32} />
                          <span className="text-xs mt-2">No file selected</span>
                       </div>
                    )}
                 </div>

                 <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload" 
                      className="inline-block cursor-pointer px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white text-sm rounded-lg transition-colors border border-white/10"
                    >
                       Select Image
                    </label>
                    <p className="text-xs text-brand-muted mt-2">Recommended: Square JPG/PNG</p>
                 </div>

                 <button 
                   onClick={handleImageUpload}
                   disabled={!selectedFile || uploading}
                   className="w-full bg-brand-gold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                 >
                    {uploading ? <Loader2 className="animate-spin" /> : 'Upload & Save'}
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AgentEditCelebrityPage;