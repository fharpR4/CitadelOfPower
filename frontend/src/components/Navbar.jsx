import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// Import logo from assets
import logo from '../assets/COP_logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Workers', href: '/workers' },
    { name: 'Sermons', href: '/sermons' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href) => location.pathname === href;

  // Inline SVG fallback (works offline)
  const logoSvg = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Crect width=\'40\' height=\'40\' fill=\'%232563eb\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-size=\'14\' fill=\'white\' font-family=\'Arial\'%3ECOP%3C/text%3E%3C/svg%3E';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo - Now using imported asset */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Citadel Of Power" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = logoSvg;
                }}
              />
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-blue-600">Citadel</span>
                <span className="text-xl font-bold text-purple-600"> Of Power</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                } block px-4 py-3 text-base font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile version of church name */}
            <div className="pt-4 mt-2 border-t border-gray-200 px-4">
              <p className="text-sm text-gray-500">Citadel Of Power</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;