import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  BookOpenIcon, 
  CakeIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Clientes', path: '/clientes', icon: UserGroupIcon },
  { name: 'Receitas', path: '/receitas', icon: BookOpenIcon },
  { name: 'Ingredientes', path: '/ingredientes', icon: CakeIcon },
];

const AppSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile sidebar */}
      <div className={`
        fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out 
        lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `} onClick={() => setIsOpen(false)}></div>
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <h1 className="text-xl font-bold text-primary-700">Receitas App</h1>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <nav className="mt-6 px-2">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link 
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-md transition-colors
                    ${location.pathname === item.path 
                      ? 'bg-primary-100 text-primary-800' 
                      : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AppSidebar;