import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  VideoCameraIcon, 
  CalendarIcon, 
  EnvelopeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Workers', href: '/admin/workers', icon: UsersIcon },
    { name: 'Sermons', href: '/admin/sermons', icon: VideoCameraIcon },
    { name: 'Events', href: '/admin/events', icon: CalendarIcon },
    { name: 'Messages', href: '/admin/contacts', icon: EnvelopeIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <img 
                src="/images/logo/logo-white.png" 
                alt="COP" 
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Crect width=\'32\' height=\'32\' fill=\'%232563eb\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-size=\'14\' fill=\'white\' font-family=\'Arial\'%3ECOP%3C/text%3E%3C/svg%3E';
                }}
              />
              <span className="font-bold text-lg hidden md:block">Citadel Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {adminNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                } flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors relative"
              >
                <BellIcon className="h-5 w-5" />
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="p-4 text-center text-gray-500">
                    <p>No new notifications</p>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.username || 'Admin'}</p>
                <p className="text-xs text-blue-200">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="hidden lg:block">Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-blue-100 hover:bg-blue-700 rounded-lg"
            >
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {adminNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`${
                  isActive(item.href)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700'
                } flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 rounded-md text-base font-medium text-red-200 hover:bg-red-600 hover:text-white transition-colors mt-4"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;