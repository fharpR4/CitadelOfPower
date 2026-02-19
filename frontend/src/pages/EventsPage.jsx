import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { eventAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { CalendarIcon, MapPinIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { format, isValid } from 'date-fns';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      
      // SAFETY CHECK: Validate the response structure
      const eventsData = response?.data?.data?.events || [];
      setEvents(eventsData);
      
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // SAFE date comparison function
  const isUpcoming = (date) => {
    if (!date) return false;
    const eventDate = new Date(date);
    const today = new Date();
    return isValid(eventDate) && eventDate >= today;
  };

  // SAFE date formatting function
  const formatEventDate = (date, includeTime = true) => {
    if (!date) return 'Date TBD';
    
    const eventDate = new Date(date);
    if (!isValid(eventDate)) return 'Date TBD';
    
    try {
      if (includeTime) {
        return format(eventDate, 'MMMM d, yyyy - h:mm a');
      }
      return format(eventDate, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date TBD';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;

  // SAFE filtering with validation
  const upcomingEvents = events.filter(e => e && e.date && isUpcoming(e.date));
  const pastEvents = events.filter(e => e && e.date && !isUpcoming(e.date));

  return (
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Church Events
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Join us for these upcoming activities and fellowship opportunities.
        </p>
      </motion.div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 ? (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 border-l-4 border-primary-600"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title || 'Untitled Event'}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="h-5 w-5 text-primary-600" />
                    <span>{formatEventDate(event.date, true)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5 text-primary-600" />
                    <span>{event.venue || 'Venue TBD'}</span>
                  </div>
                </div>
                <p className="text-gray-700">{event.description || 'No description available.'}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gray-50 rounded-2xl mb-12"
        >
          <CalendarDaysIcon className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Upcoming Events</h3>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Check back soon for new events and fellowship opportunities.
          </p>
        </motion.div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 opacity-75"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title || 'Untitled Event'}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{formatEventDate(event.date, false)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5" />
                    <span>{event.venue || 'Venue TBD'}</span>
                  </div>
                </div>
                <p className="text-gray-700">{event.description || 'No description available.'}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        events.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-gray-50 rounded-2xl"
          >
            <CalendarDaysIcon className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Past Events</h3>
            <p className="text-gray-500 text-lg">
              Your event history will appear here.
            </p>
          </motion.div>
        )
      )}

      {/* No events at all */}
      {events.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-gradient-to-b from-gray-50 to-white rounded-3xl"
        >
          <CalendarDaysIcon className="h-32 w-32 mx-auto text-primary-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">No Events Scheduled</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            We're currently planning our next church events. 
            Please check back soon for updates!
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EventsPage;