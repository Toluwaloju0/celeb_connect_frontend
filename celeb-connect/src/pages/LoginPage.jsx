import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react'; // Imports shortened for brevity
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import Hook

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use Context
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Call Login from Context
    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[450px] bg-[#1a1a1a] border border-brand-goldDim/20 rounded-3xl p-8 shadow-2xl relative">
        
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Sign In</h1>
          <p className="text-brand-muted text-sm">Access your celebrity dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Inputs remain exactly the same as previous design */}
          <div className="space-y-1.5">
            <label className="text-white text-sm font-semibold flex items-center gap-1">Email Address <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-brand-muted/50 focus:outline-none focus:border-brand-gold/50 transition-all" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-white text-sm font-semibold flex items-center gap-1">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-brand-muted/50 focus:outline-none focus:border-brand-gold/50 transition-all pr-10" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-brand-gold hover:bg-yellow-500 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
            {loading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-brand-muted">
          Don't have an account? <Link to="/signup" className="text-brand-gold font-semibold hover:underline">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;