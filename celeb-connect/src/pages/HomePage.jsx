import React, { useState, useEffect } from 'react';
import { 
  Star, Calendar, User, CheckCircle2, AlertTriangle, 
  Clock, MapPin, MessageSquare, ChevronRight, 
  CreditCard, Bell, Settings, ShieldCheck, LayoutDashboard 
} from 'lucide-react';

const HomePage = () => {
  // Retrieve user data stored during login (fallback to design placeholder)
  const [user, setUser] = useState({ name: 'Sarah Mitchell' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Use the name from backend if available, otherwise stick to design default
      if(parsed.name) setUser(parsed);
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 font-sans pb-12">
      
      {/* --- Navigation Bar --- */}
      <nav className="border-b border-white/10 bg-[#121212] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-brand-gold fill-brand-gold" />
            <div>
              <h1 className="text-xl font-serif font-bold text-brand-gold leading-none">CelebConnect</h1>
              <p className="text-[10px] text-brand-muted uppercase tracking-wider">Premium Celebrity Experiences</p>
            </div>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-1">
             <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
             <NavItem icon={<Star size={18} />} label="Book Experience" />
             <NavItem icon={<Calendar size={18} />} label="My Bookings" />
             <NavItem icon={<ShieldCheck size={18} />} label="Verification" />
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
               <p className="text-sm font-medium text-white">{user.name}</p>
               <p className="text-xs text-brand-gold">Verified Member</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center">
               <User className="text-brand-gold" size={20} />
            </div>
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">

        {/* 1. Notifications Area */}
        <div className="space-y-4">
          <NotificationBanner 
            type="success"
            title="Booking Confirmed!"
            desc="Your meet & greet with Emma Watson is confirmed for January 15, 2026"
            action="View Details"
          />
           <NotificationBanner 
            type="warning"
            title="Payment Pending"
            desc="Complete your payment for Zendaya vacation booking to secure your spot"
            action="Complete Payment"
          />
        </div>

        {/* 2. Welcome Header & Stats */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-serif text-white mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-900/30 border border-green-500/30 text-green-500 text-xs font-medium">
              <CheckCircle2 size={12} /> Verified Fan
            </span>
          </div>
          
          <div className="flex gap-4">
            <StatBox icon={<Calendar size={20} />} val="3" label="Upcoming" />
            <StatBox icon={<Star size={20} />} val="12" label="Experiences" />
            <StatBox icon={<CreditCard size={20} />} val="2450" label="Points" />
          </div>
        </div>

        {/* 3. Grid Layout: Main Content vs Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Bookings Section */}
            <div>
               <SectionHeader title="Upcoming Bookings" action="View All" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <BookingCard 
                    name="Emma Watson"
                    type="Meet Greet"
                    date="01/15/2026 at 3:00 PM"
                    loc="Beverly Hills Convention Center"
                    status="confirmed"
                    img="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                  />
                  <BookingCard 
                    name="Chris Hemsworth"
                    type="Appointment"
                    date="01/22/2026 at 11:00 AM"
                    loc="Sydney Opera House, Australia"
                    status="confirmed"
                    img="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop"
                  />
               </div>
            </div>

            {/* Recommended Section */}
            <div>
               <SectionHeader title="Recommended For You" action="Explore" icon={<Star size={14}/>} />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <RecommendedCard 
                     title="Private Dinner with Gordon Ramsay"
                     desc="Exclusive culinary experience with world-renowned chef"
                     price="$2500"
                     rating="4.9 (156)"
                     discount="15% OFF"
                     img="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop"
                  />
                  <RecommendedCard 
                     title="Tennis Lesson with Serena Williams"
                     desc="One-on-one coaching session with tennis legend"
                     price="$3200"
                     rating="5.0 (203)"
                     img="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop"
                  />
               </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6 md:p-8">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-serif text-white">Recent Activity</h3>
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <LayoutDashboard size={14} className="text-brand-gold" />
                 </div>
               </div>
               
               <div className="space-y-6 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-white/10"></div>
                  
                  <ActivityItem 
                    icon={<CheckCircle2 size={16} className="text-green-500" />}
                    text="Your booking with Emma Watson has been confirmed"
                    time="1h ago"
                  />
                  <ActivityItem 
                    icon={<Calendar size={16} className="text-red-500" />}
                    text="Chris Hemsworth has new availability slots for February 2026"
                    time="2h ago"
                  />
                  <ActivityItem 
                    icon={<CreditCard size={16} className="text-brand-gold" />}
                    text="Exclusive 20% discount on vacation packages with verified celebrities"
                    time="1d ago"
                  />
                  <ActivityItem 
                    icon={<Bell size={16} className="text-yellow-500" />}
                    text="Your Zendaya vacation booking payment is pending completion"
                    time="2d ago"
                  />
                  <ActivityItem 
                    icon={<ShieldCheck size={16} className="text-green-500" />}
                    text="Congratulations! Your fan verification status has been upgraded"
                    time="3d ago"
                  />
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
              <h3 className="text-xl font-serif text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <ActionRow icon={<ShieldCheck />} title="Verification Center" subtitle="Upgrade your fan status" />
                <ActionRow icon={<Clock />} title="Booking History" subtitle="View all past bookings" />
                <ActionRow icon={<CreditCard />} title="Payment Methods" subtitle="Manage saved options" />
                <ActionRow icon={<Bell />} title="Notification Settings" subtitle="Customize alerts" />
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
               <h3 className="text-xl font-serif text-white mb-6">Your Impact</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-white/5 pb-3">
                    <span className="text-sm text-brand-muted">Total Spent</span>
                    <span className="text-lg font-serif text-brand-gold">$18,750</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-3">
                    <span className="text-sm text-brand-muted">Member Since</span>
                    <span className="text-sm text-white">March 2024</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-brand-muted">Next Reward</span>
                    <span className="text-xs text-red-400">550 points away</span>
                  </div>
               </div>
            </div>

          </div>

        </div>

        {/* Footer CTA */}
        <div className="mt-12 border border-brand-gold/20 bg-gradient-to-r from-[#1a1a1a] via-[#222] to-[#1a1a1a] rounded-3xl p-10 text-center relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-3xl font-serif text-white mb-3">Ready for Your Next Celebrity Experience?</h2>
              <p className="text-brand-muted mb-8 max-w-xl mx-auto">Discover exclusive opportunities to meet your favorite celebrities, attend private events, and create unforgettable memories</p>
              <button className="bg-brand-gold hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-brand-gold/10 flex items-center gap-2 mx-auto">
                <Star size={18} /> Browse Celebrity Experiences
              </button>
           </div>
        </div>

      </main>
    </div>
  );
};

// --- Sub Components for Clean Code ---

const NavItem = ({ icon, label, active }) => (
  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brand-gold text-black' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}>
    {icon} {label}
  </button>
);

const NotificationBanner = ({ type, title, desc, action }) => {
  const styles = type === 'success' 
    ? 'border-green-500/30 bg-green-900/10' 
    : 'border-yellow-500/30 bg-yellow-900/10';
  
  const icon = type === 'success' 
    ? <CheckCircle2 className="text-green-500 mt-0.5" size={18} />
    : <AlertTriangle className="text-yellow-500 mt-0.5" size={18} />;

  return (
    <div className={`border rounded-xl p-4 flex items-start justify-between ${styles}`}>
      <div className="flex gap-3">
        {icon}
        <div>
          <h4 className="text-white text-sm font-semibold">{title}</h4>
          <p className="text-brand-muted text-xs">{desc}</p>
        </div>
      </div>
      <button className="text-xs text-brand-gold hover:underline whitespace-nowrap ml-4 flex items-center gap-1">
        {action} <ArrowSmallRight />
      </button>
    </div>
  );
};

const StatBox = ({ icon, val, label }) => (
  <div className="flex flex-col items-center justify-center w-24 h-24 bg-[#121212] border border-white/5 rounded-2xl hover:border-brand-gold/30 transition-colors group">
    <div className="text-brand-muted group-hover:text-brand-gold transition-colors mb-1">{icon}</div>
    <span className="text-xl font-bold text-white leading-none">{val}</span>
    <span className="text-[10px] text-brand-muted uppercase tracking-wide mt-1">{label}</span>
  </div>
);

const SectionHeader = ({ title, action, icon }) => (
  <div className="flex justify-between items-end">
    <h3 className="text-xl font-serif text-white">{title}</h3>
    <button className="text-xs text-white hover:text-brand-gold flex items-center gap-1 transition-colors">
      {icon && icon} {action} <ArrowSmallRight />
    </button>
  </div>
);

const BookingCard = ({ name, type, date, loc, status, img }) => (
  <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 hover:border-brand-gold/20 transition-all group relative overflow-hidden">
    <div className="flex justify-between items-start mb-4 relative z-10">
       <div className="flex items-center gap-3">
          {/* Avatar (Placeholder) */}
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border border-white/10">
             <img src={img} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-white font-serif font-bold text-sm">{name}</h4>
            <p className="text-xs text-brand-muted flex items-center gap-1"><User size={10} /> {type}</p>
          </div>
       </div>
       <span className="text-[10px] uppercase border border-green-500/30 text-green-500 px-2 py-0.5 rounded-full bg-green-900/20">{status}</span>
    </div>
    
    <div className="space-y-2 mb-5 relative z-10">
       <div className="flex items-center gap-2 text-xs text-gray-400">
         <Calendar size={14} className="text-brand-gold" /> {date}
       </div>
       <div className="flex items-center gap-2 text-xs text-gray-400">
         <MapPin size={14} className="text-brand-gold" /> {loc}
       </div>
    </div>

    <div className="grid grid-cols-2 gap-3 relative z-10">
      <button className="text-xs text-white border border-white/10 rounded-lg py-2 hover:bg-white/5">View Details</button>
      <button className="text-xs bg-brand-gold text-black font-semibold rounded-lg py-2 hover:bg-yellow-500 flex items-center justify-center gap-1">
         <MessageSquare size={12} /> Contact
      </button>
    </div>
  </div>
);

const RecommendedCard = ({ title, desc, price, rating, discount, img }) => (
  <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-brand-gold/30 transition-all group">
    <div className="h-32 bg-gray-800 relative">
       <img src={img} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
       {discount && <span className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">{discount}</span>}
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
         <h4 className="text-white font-serif font-bold text-sm leading-tight flex-1 mr-2">{title}</h4>
         <span className="text-brand-gold font-bold text-sm">{price}</span>
      </div>
      <p className="text-xs text-brand-muted mb-3 line-clamp-2">{desc}</p>
      
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-1 text-xs text-yellow-500">
            <Star size={12} fill="currentColor" /> {rating}
         </div>
         <button className="text-xs bg-brand-gold text-black px-4 py-1.5 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
            Book Now <ArrowSmallRight />
         </button>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ icon, text, time }) => (
  <div className="flex gap-4 relative pl-2 group">
     {/* Dot on line */}
     <div className="absolute left-[3px] top-1 w-2 h-2 rounded-full bg-[#1a1a1a] border border-white/20 group-hover:border-brand-gold transition-colors z-10"></div>
     
     <div className="mt-0.5 shrink-0 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center border border-white/5">
        {icon}
     </div>
     <div className="flex-1">
        <p className="text-sm text-gray-300 leading-snug">{text}</p>
        <span className="text-[10px] text-brand-muted">{time}</span>
     </div>
  </div>
);

const ActionRow = ({ icon, title, subtitle }) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
     <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center text-brand-gold group-hover:text-white transition-colors">
           {icon}
        </div>
        <div>
           <h4 className="text-sm font-medium text-white">{title}</h4>
           <p className="text-[10px] text-brand-muted">{subtitle}</p>
        </div>
     </div>
     <ChevronRight size={16} className="text-brand-muted group-hover:translate-x-1 transition-transform" />
  </div>
);

// Little arrow helper
const ArrowSmallRight = () => (
  <span className="inline-block">→</span>
);

export default HomePage;
