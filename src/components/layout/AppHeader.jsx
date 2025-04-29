import { useState } from 'react';
import { Bars3Icon, BellIcon, UserIcon } from '@heroicons/react/24/outline';

const AppHeader = ({ onMenuToggle }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-4">
      <button 
        onClick={onMenuToggle}
        className="text-gray-600 lg:hidden focus:outline-none"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      
      <div className="ml-auto flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-800">
          <BellIcon className="h-6 w-6" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
              <UserIcon className="h-5 w-5" />
            </div>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Perfil
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Configurações
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Sair
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;