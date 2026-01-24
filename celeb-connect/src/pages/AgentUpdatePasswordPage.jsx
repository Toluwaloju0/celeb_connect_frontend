import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldAlert, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AgentUpdatePasswordPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Basic Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // 2. API Call (PATCH request as requested)
      const response = await api.patch('/agent/password', {
        old_password: formData.oldPassword,
        new_password: formData.newPassword
      });

      if (response.data.status === true) {
        // 3. Update local user state to reflect 'verified' status so they aren't redirected back here
        const updatedUser = { ...user, email_verified: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // 4. Redirect to Agent Dashboard
        navigate('/agent/dashboard');
      } else {
        setError(response.data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4 font-sans">
      
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent"></div>

      <div className="w-full max-w-[480px] bg-[#0f172a] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-cyan-900/20 border border-cyan-500/20 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="text-cyan-500" size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">
            Security Update Required
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed px-4">
            You are currently using a <span className="text-cyan-400 font-medium">temporary password</span> provided by the administrator. For security reasons, you must set a new password before accessing the dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2 justify-center">
              <ShieldAlert size={14} /> {error}
            </div>
          )}

          {/* Old Password */}
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-semibold ml-1">Temporary Password</label>
            <div className="relative">
              <input 
                type={showOld ? "text" : "password"} 
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter the password from your email"
                className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
                required
              />
              <button 
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="h-px bg-white/5 my-2"></div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-semibold ml-1">New Password</label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"} 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Create a new secure password"
                className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm pr-10"
                required
              />
               <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-semibold ml-1">Confirm New Password</label>
            <input 
              type={showNew ? "text" : "password"} 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your new password"
              className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
              required
            />
          </div>

          {/* Password Requirements (Visual Only) */}
          <div className="flex gap-4 text-[10px] text-gray-500 px-1">
             <div className={`flex items-center gap-1 ${formData.newPassword.length >= 6 ? 'text-green-500' : ''}`}>
               <CheckCircle2 size={10} /> Min 6 chars
             </div>
             <div className={`flex items-center gap-1 ${formData.newPassword && formData.newPassword === formData.confirmPassword ? 'text-green-500' : ''}`}>
               <CheckCircle2 size={10} /> Passwords match
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 text-sm mt-4"
          >
            {loading ? 'Updating...' : <>Update Password & Login <ArrowRight size={16} /></>}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AgentUpdatePasswordPage;