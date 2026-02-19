import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  MagnifyingGlassIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { contactAPI } from '../../services/api';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, read, unread

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getAll();
      // Handle the response structure from your backend
      const messagesData = response.data.data?.messages || [];
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
  };

  const handleMarkAsRead = async (id, isRead) => {
    try {
      await contactAPI.update(id, { isRead: !isRead });
      // Update local state instead of refetching all
      setMessages(prev => prev.map(msg => 
        msg._id === id ? { ...msg, isRead: !isRead } : msg
      ));
      if (selectedMessage?._id === id) {
        setSelectedMessage(prev => ({ ...prev, isRead: !isRead }));
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }
    
    try {
      await contactAPI.delete(id);
      setMessages(prev => prev.filter(msg => msg._id !== id));
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const filteredMessages = messages
    .filter(msg => {
      if (filter === 'read') return msg.isRead === true;
      if (filter === 'unread') return msg.isRead === false;
      return true;
    })
    .filter(msg =>
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const unreadCount = messages.filter(m => !m.isRead).length;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
            <p className="text-gray-600 mt-1">
              {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
            />
          </div>
          
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="read">Read ({messages.length - unreadCount})</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No messages found</p>
              {searchTerm && (
                <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
              )}
            </div>
          ) : (
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?._id === msg._id ? 'bg-blue-50' : ''
                  } ${!msg.isRead ? 'border-l-4 border-blue-600 bg-blue-50/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1 line-clamp-1">{msg.subject}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{msg.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{msg.email}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(msg._id, msg.isRead);
                        }}
                        className={`p-1 rounded transition-colors ${
                          msg.isRead 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg._id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      {selectedMessage.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <EnvelopeIcon className="h-4 w-4" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {formatDate(selectedMessage.createdAt)}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedMessage.isRead 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedMessage.isRead ? 'Read' : 'Unread'}
                </span>
              </div>

              <div className="border-t pt-6">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="border-t mt-6 pt-6 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => handleMarkAsRead(selectedMessage._id, selectedMessage.isRead)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMessage.isRead
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <EnvelopeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Message Selected</h3>
              <p className="text-gray-500">
                Click on a message from the list to view its contents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;