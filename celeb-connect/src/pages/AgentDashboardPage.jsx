import React from 'react';
import { useAuth } from '../context/AuthContext';

const AgentDashboardPage = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-serif text-cyan-500 mb-4">Agent Dashboard</h1>
      <p className="mb-4">Welcome, {user?.name}</p>
      <button onClick={logout} className="text-red-500 underline">Logout</button>
    </div>
  );
};
export default AgentDashboardPage;