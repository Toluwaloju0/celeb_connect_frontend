import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock, BadgeCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Access the Env Variable
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (result.status === true) {
        // Optional: Save user data/token to localStorage if needed
        console.log("Login Data:", result.data);
        localStorage.setItem('user', JSON.stringify(result.data));
        
        // Redirect to Home
        navigate('/home');
      } else {
        // Handle API returning false status (e.g., wrong password)
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[450px] bg-[#1a1a1a] border border-brand-goldDim/20 rounded-3xl p-8 shadow-2xl relative">
        
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Sign In</h1>
          <p className="text-brand-muted text-sm">Access your celebrity dashboard</p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-white text-sm font-semibold flex items-center gap-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-brand-muted/50 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white text-sm font-semibold flex items-center gap-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-brand-muted/50 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all pr-10"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-white">
              <input type="checkbox" className="accent-brand-gold w-4 h-4 rounded border-gray-600" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-brand-gold hover:text-brand-goldDim transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-gold hover:bg-yellow-500 disabled:bg-brand-gold/50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-brand-gold/10 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-brand-muted">
          Don't have an account? <Link to="/signup" className="text-brand-gold font-semibold hover:underline">Create account</Link>
        </div>

        {/* ... (Keeping existing Social/Footer code from previous implementation) ... */}
        
        {/* Simplified Footer for brevity in this snippet (Use previous code for full footer) */}
        <div className="mt-8 pt-4 border-t border-white/10 text-center text-[10px] text-brand-muted">
             Protected by CelebConnect Security
        </div>

      </div>
    </div>
  );
};

export default LoginPage;