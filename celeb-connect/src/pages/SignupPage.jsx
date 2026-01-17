import React, { useState } from 'react';
import { User, Lock, Settings, ShieldCheck, ArrowLeft, ArrowRight, Star, AlertCircle, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import Hook

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth(); // Use Context

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', dob: '', password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(error) setError('');
  };

  const handleContinue = async () => {
    if(!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.dob || !formData.phone) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    
    // Format payload
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      date_of_birth: new Date(formData.dob).toISOString(),
      password: formData.password,
      phone_number: formData.phone
    };

    // Call Signup from Context
    const result = await signup(payload);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // ... Rest of the UI remains identical to previous design ...
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col p-4 md:p-8 font-sans">
       {/* (Keep existing Navbar, Stepper, and Form UI code) */}
       {/* Just ensure the <form> section uses the logic above */}
       
       <div className="w-full max-w-2xl mx-auto bg-[#1a1a1a] border border-brand-goldDim/20 rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-serif text-white mb-2">Personal Information</h2>
             <p className="text-brand-muted text-sm">Let's start with your basic details</p>
          </div>
          
          {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">{error}</div>}

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Fields for Name, Email, Phone, Password, DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <InputField label="First Name" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} />
                 <InputField label="Last Name" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} />
              </div>
              
              {/* ... Other inputs ... */}
               <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
               <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
               <InputField label="Create Password" name="password" type="password" value={formData.password} onChange={handleChange} />
               <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />

               {/* Buttons */}
               <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/5">
                 <button type="button" onClick={() => navigate('/login')} className="text-brand-muted hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors">Back</button>
                 <button type="button" onClick={handleContinue} disabled={loading} className="bg-brand-gold hover:bg-yellow-500 disabled:opacity-50 text-black font-bold py-3 px-8 rounded-xl flex items-center gap-2">
                    {loading ? 'Processing...' : <>Continue <ArrowRight size={18} /></>}
                 </button>
               </div>
          </form>
       </div>
    </div>
  );
};

// Helper Input Component (Same as before)
const InputField = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-white text-xs font-semibold flex items-center gap-1">{label} <span className="text-red-500">*</span></label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50 transition-all" />
  </div>
);

export default SignupPage;