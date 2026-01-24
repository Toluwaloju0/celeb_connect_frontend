import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
        <h1 className="text-xl font-serif font-bold text-white mb-8">Admin Panel</h1>
        
        <nav className="space-y-2 flex-1">
           <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
           <NavItem icon={<Users size={18} />} label="User Management" />
           <NavItem icon={<Settings size={18} />} label="System Settings" />
        </nav>

        <button onClick={logout} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
            <LogOut size={18} /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-bold">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-red-900/30 rounded-full border border-red-500/30 flex items-center justify-center text-red-500 font-bold">
                    A
                </div>
            </div>
        </header>

        <div className="p-12 border border-dashed border-white/10 rounded-2xl bg-[#111] text-center text-gray-500">
            Admin Dashboard Content Loading...
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active }) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${active ? 'bg-white text-black font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
        {icon} <span className="text-sm">{label}</span>
    </div>
);

export default AdminDashboardPage;
