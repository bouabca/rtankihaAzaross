'use client';

import { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Mock notifications
  const notifications = [
    { id: 1, message: 'Maintenance required for AC Unit 2', time: '10 minutes ago', type: 'warning' },
    { id: 2, message: 'New face detected in security zone', time: '1 hour ago', type: 'alert' },
    { id: 3, message: 'AC Controller optimization complete', time: '3 hours ago', type: 'info' },
  ];

  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6">
      <div className="flex-1">
        <div className="relative max-w-md w-full">
          <input 
            type="text" 
            placeholder="Search..." 
            className="input-field w-full pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-full hover:bg-gray-100 relative"
          >
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 bg-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notifications.length}
            </span>
          </button>
          
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold">Notifications</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-2 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center border-t border-gray-200">
                <Link href="/notifications" className="text-xs text-primary hover:underline">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <span>A</span>
            </div>
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Your Profile
              </Link>
              <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <Link href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Sign out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;