import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  UserGroupIcon, 
  VideoCameraIcon, 
  CalendarIcon,
  EnvelopeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { workerAPI, sermonAPI, eventAPI, contactAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalSermons: 0,
    upcomingEvents: 0,
    unreadMessages: 0
  });
  const [recentItems, setRecentItems] = useState({
    workers: [],
    sermons: [],
    events: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [workersRes, sermonsRes, eventsRes, contactsRes] = await Promise.all([
        workerAPI.getAll(),
        sermonAPI.getAll(),
        eventAPI.getUpcoming(),
        contactAPI.getAll()
      ]);
      
      setStats({
        totalWorkers: workersRes.data.results || workersRes.data.data?.workers?.length || 0,
        totalSermons: sermonsRes.data.results || sermonsRes.data.data?.sermons?.length || 0,
        upcomingEvents: eventsRes.data.results || eventsRes.data.data?.events?.length || 0,
        unreadMessages: contactsRes.data.data?.messages?.filter(m => !m.isRead).length || 0
      });

      setRecentItems({
        workers: workersRes.data.data?.workers?.slice(0, 3) || [],
        sermons: sermonsRes.data.data?.sermons?.slice(0, 3) || [],
        events: eventsRes.data.data?.events?.slice(0, 3) || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Workers', 
      value: stats.totalWorkers, 
      icon: UserGroupIcon, 
      color: 'bg-blue-500',
      link: '/admin/workers'
    },
    { 
      title: 'Total Sermons', 
      value: stats.totalSermons, 
      icon: VideoCameraIcon, 
      color: 'bg-purple-500',
      link: '/admin/sermons'
    },
    { 
      title: 'Upcoming Events', 
      value: stats.upcomingEvents, 
      icon: CalendarIcon, 
      color: 'bg-green-500',
      link: '/admin/events'
    },
    { 
      title: 'Unread Messages', 
      value: stats.unreadMessages, 
      icon: EnvelopeIcon, 
      color: 'bg-orange-500',
      link: '/admin/contacts'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome back, {user?.username || 'Admin'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with Citadel of Power
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.link} className="block">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <h3 className="text-gray-600 font-medium">{stat.title}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/workers"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserGroupIcon className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Worker</span>
          </Link>
          <Link
            to="/admin/sermons"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <VideoCameraIcon className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Sermon</span>
          </Link>
          <Link
            to="/admin/events"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <CalendarIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Event</span>
          </Link>
          <Link
            to="/admin/contacts"
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <EnvelopeIcon className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Messages</span>
          </Link>
        </div>
      </motion.div>

      {/* Recent Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Workers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Workers</h3>
            <Link to="/admin/workers" className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>
          {recentItems.workers.length > 0 ? (
            <div className="space-y-3">
              {recentItems.workers.map((worker, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{worker.name}</p>
                    <p className="text-sm text-gray-600">{worker.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No workers yet</p>
          )}
        </motion.div>

        {/* Recent Sermons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Sermons</h3>
            <Link to="/admin/sermons" className="text-sm text-purple-600 hover:text-purple-700">
              View All →
            </Link>
          </div>
          {recentItems.sermons.length > 0 ? (
            <div className="space-y-3">
              {recentItems.sermons.map((sermon, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <VideoCameraIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{sermon.title}</p>
                    <p className="text-sm text-gray-600">by {sermon.preacher}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No sermons yet</p>
          )}
        </motion.div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
            <Link to="/admin/events" className="text-sm text-green-600 hover:text-green-700">
              View All →
            </Link>
          </div>
          {recentItems.events.length > 0 ? (
            <div className="space-y-3">
              {recentItems.events.map((event, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming events</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;