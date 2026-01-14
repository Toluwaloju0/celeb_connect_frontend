import React, { useState } from 'react';
import { User, Lock, Settings, ShieldCheck, ArrowLeft, ArrowRight, Star, AlertCircle, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Added 'password' to state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    password: '' 
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(error) setError('');
  };

  const handleContinue = async () => {
    // Basic Validation
    if(!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.dob || !formData.phone) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    
    // Formatting Data for Backend
    // 1. Convert Date to ISO Format (YYYY-MM-DDTHH:mm:ss.sssZ)
    const dobISO = new Date(formData.dob).toISOString();

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      date_of_birth: dobISO,
      password: formData.password,
      phone_number: formData.phone
    };

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === true) {
        console.log("Signup Success:", result.data);
        // Optionally save token here
        navigate('/home');
      } else {
        setError(result.message || 'Signup failed.');
      }

    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col p-4 md:p-8 font-sans">
      
      {/* Top Nav */}
      <nav className="flex justify-between items-center max-w-5xl mx-auto w-full mb-8">
        <div className="flex items-center gap-2">
           <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
           <div>
             <h1 className="text-lg font-serif font-bold text-brand-gold leading-none">CelebConnect</h1>
             <p className="text-[10px] text-brand-muted uppercase tracking-wider leading-none">Premium Celebrity Experiences</p>
           </div>
        </div>
        <Link to="/login" className="text-brand-muted hover:text-white text-sm flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </nav>

      {/* Stepper */}
      <div className="max-w-3xl mx-auto w-full mb-10 px-4">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-[#2a2a2a] -z-10"></div>
          <StepItem icon={<User size={18} />} label="Personal Info" active={true} />
          <StepItem icon={<Lock size={18} />} label="Account Setup" />
          <StepItem icon={<Settings size={18} />} label="Preferences" />
          <StepItem icon={<ShieldCheck size={18} />} label="Verification" />
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl mx-auto bg-[#1a1a1a] border border-brand-goldDim/20 rounded-3xl p-6 md:p-10 shadow-2xl">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-white mb-2">Personal Information</h2>
          <p className="text-brand-muted text-sm">Let's start with your basic details</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="First Name" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} />
            <InputField label="Last Name" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Email Address" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} />
            <InputField label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
          </div>
          
          {/* Added Password Field */}
          <InputField 
            label="Create Password" 
            name="password" 
            type="password"
            placeholder="Create a strong password" 
            value={formData.password}
            onChange={handleChange}
          />

          <InputField 
            label="Date of Birth" 
            name="dob" 
            type="date"
            placeholder="dd/mm/yyyy" 
            helpText="You must be 18 or older to create an account"
            value={formData.dob}
            onChange={handleChange}
          />

          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-4 flex gap-3 mt-2">
            <AlertCircle className="text-brand-gold shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-brand-text text-sm font-semibold mb-1">Age Verification Required</h4>
              <p className="text-brand-muted text-xs leading-relaxed">
                CelebConnect requires all users to be at least 18 years old to book celebrity experiences.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/5">
            {/* Back Button Logic */}
            <button 
              type="button" 
              onClick={() => navigate('/login')}
              className="text-brand-muted hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} /> Back
            </button>
            
            {/* Continue / Submit Button */}
            <button 
              type="button" 
              onClick={handleContinue}
              disabled={loading}
              className="bg-brand-gold hover:bg-yellow-500 disabled:bg-brand-gold/50 text-black font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-brand-gold/10 flex items-center gap-2"
            >
              {loading ? 'Processing...' : <>Continue <ArrowRight size={18} /></>}
            </button>
          </div>

        </form>
      </div>
      
      {/* Footer Socials (retained from design) */}
      <div className="max-w-2xl mx-auto w-full mt-8 grid grid-cols-3 gap-4">
           {/* ... Social Buttons ... */}
      </div>

    </div>
  );
};

const InputField = ({ label, name, type = "text", placeholder, helpText, value, onChange }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-white text-xs font-semibold flex items-center gap-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <input 
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-brand-muted/40 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all"
    />
    {helpText && <p className="text-[#555] text-[11px]">{helpText}</p>}
  </div>
);

const StepItem = ({ icon, label, active }) => (
  <div className="flex flex-col items-center gap-2 z-10 bg-neutral-950 px-2">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${active ? 'bg-brand-gold border-brand-gold text-black' : 'bg-[#1a1a1a] border-[#333] text-brand-muted'}`}>
      {icon}
    </div>
    <span className={`text-[10px] sm:text-xs font-medium uppercase tracking-wide ${active ? 'text-brand-gold' : 'text-brand-muted/50'}`}>
      {label}
    </span>
  </div>
);

export default SignupPage;
