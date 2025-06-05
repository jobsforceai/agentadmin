import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, Calendar, Users, Briefcase, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink = ({ to, icon, label }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavLink 
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-[#3fe3ff] bg-opacity-20 text-gray-900' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { 
        className: `h-5 w-5 ${isActive ? 'text-gray-900' : 'text-gray-500'}`
      })}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const { logout } = useAuthStore();
  const adminInfo = useAuthStore((state) => state.adminInfo);

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <img 
            src="https://jobsforce.ai/logo-blacktext.png" 
            alt="JobsForce Logo" 
            className="h-8"
          />
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">Admin Portal</p>
          <p className="text-sm text-gray-700 truncate">{adminInfo?.email}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          <SidebarLink to="/dashboard" icon={<BarChart3 />} label="Dashboard" />
          <SidebarLink to="/agents" icon={<Users />} label="Agents" />
          <SidebarLink to="/users" icon={<Briefcase />} label="Users" />
          <SidebarLink to="/meetings" icon={<Calendar />} label="Meetings" />
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;