import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { contactAPI } from '../services/api';  // Use your API service, not direct axios

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // Use your existing contactAPI instead of direct axios
      const response = await contactAPI.create(formData);
      
      // Check the response structure from your backend
      if (response.data.status === 'success') {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent. We will get back to you soon.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setStatus({ type: null, message: '' }), 5000);
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send message. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Contact <span className="text-blue-600">Citadel of Power</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We'd love to hear from you. Reach out with any questions, prayer requests, 
          or to plan your visit.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Get In Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPinIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                <p className="text-gray-600">
                  Watford North, Library St Albans RD,<br/>
                  Hertfordshire WD24 7RW, United Kingdom
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <PhoneIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-600">+(44) 7386-894093</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-600">citadelofpowerrccg@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Service Times</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Sunday:</span> 9:00 AM & 11:00 AM<br />
                  <span className="font-medium">Wednesday:</span> 7:00 PM (Bible Study)<br />
                  <span className="font-medium">Friday:</span> 7:00 PM (Prayer Meeting)
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-8 bg-gray-200 rounded-xl h-80 overflow-hidden">
            <iframe
              title="Church Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2475.2858!2d-0.3963!3d51.6632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48764b1e3c8c8c8d%3A0x4c8c8c8c8c8c8c8c!2sWatford%20North%2C%20Library%20St%20Albans%20RD%2C%20Hertfordshire%20WD24%207RW!5e0!3m2!1sen!2suk!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Send Us a Message</h2>
          
          {/* Status Messages */}
          {status.type === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">{status.message}</p>
            </div>
          )}

          {status.type === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{status.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none disabled:bg-gray-100"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4">
            * Required fields. We'll respond within 24-48 hours.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;