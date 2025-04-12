'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Face Recognition', path: '/face-recognition', icon: '👤' },
    { name: 'AC Controller', path: '/ac-controller', icon: '❄️' },
    { name: 'Maintenance', path: '/maintenance', icon: '🔧' },
    { name: 'Node-RED', path: '/node-red', icon: '🔄' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="bg-dark text-white w-64 flex-shrink-0 hidden md:block">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">rtankihaAzaross</h2>
        <p className="text-xs text-gray-400">Integrated Dashboard</p>
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 ${pathname === item.path ? 'bg-gray-800 text-white' : ''}`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
            <span>A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">System Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;