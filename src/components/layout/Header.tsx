import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 justify-between">
      <div className="flex items-center lg:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar}
          className="p-1"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;