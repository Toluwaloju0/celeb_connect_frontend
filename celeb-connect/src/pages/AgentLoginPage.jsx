import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Briefcase, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AgentLoginPage = () => {
  const navigate = useNavigate();
  const { agentLogin } = useAuth(); // Use specific agent login
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Call Agent Login
    const result = await agentLogin(formData.email, formData.password);

    if (result.success) {
      // Check validation status from the response data
      if (result.data.email_verified === false) {
         navigate('/agent/update-password');
      } else {
         navigate('/agent/dashboard');
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4 font-sans">
      
      {/* Background decoration (Cyan/Blue for Agents) */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent"></div>

      <div className="w-full max-w-[400px] bg-[#0f172a] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-cyan-900/20 rounded-full flex items-center justify-center mb-4 border border-cyan-500/20">
             <Briefcase className="text-cyan-500" size={24} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">
            Agent Portal
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Representative Access
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center flex items-center justify-center gap-2">
            <Lock size={12} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-semibold ml-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="agent@celebconnect.com"
              className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-semibold ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all pr-10 text-sm"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 text-sm mt-2"
          >
            {loading ? 'Authenticating...' : <>Login to Portal <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-600">
                Unauthorized access is strictly prohibited.
            </p>
        </div>

      </div>
    </div>
  );
};

export default AgentLoginPage;