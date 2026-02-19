import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Citadel Of Power</h3>
            <p className="text-gray-400 mb-4">
              A place where faith meets power and prayer brings change. 
              Join us in experiencing the transforming power of God.
            </p>
            <div className="flex items-center space-x-2 text-gray-500">
              <span>Made with</span>
              <HeartIcon className="h-4 w-4 text-red-500" />
              <span>for God's people</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/workers" className="text-gray-400 hover:text-blue-400 transition">Workers</Link></li>
              <li><Link to="/sermons" className="text-gray-400 hover:text-blue-400 transition">Sermons</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-blue-400 transition">Events</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-blue-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Watford North, Library St Albans RD</li>
              <li>Hertfordshire WD24 7RW</li>
              <li>United Kingdom</li>
              <li className="pt-2">+(44) 7386-894093</li>
              <li>citadelofpowerrccg@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Citadel Of Power. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
