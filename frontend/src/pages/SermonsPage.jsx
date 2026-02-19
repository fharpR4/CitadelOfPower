import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  VideoCameraIcon, 
  CalendarIcon, 
  UserIcon,
  PlayIcon,
  MagnifyingGlassIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { format, isValid, parseISO } from 'date-fns';
import { sermonAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const SermonsPage = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      const response = await sermonAPI.getAll();
      const sermonsData = response.data.data?.sermons || [];
      setSermons(sermonsData);
      
      // Extract unique series for filter
      const uniqueSeries = [...new Set(sermonsData.map(s => s.series).filter(Boolean))];
      setSeries(uniqueSeries);
      
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  // SAFE date formatting function
  const formatSermonDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    
    try {
      // Try to parse the date
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      
      // Check if date is valid
      if (!isValid(date)) {
        return 'Date TBD';
      }
      
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date TBD';
    }
  };

  // Filter sermons based on search and series
  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = searchTerm === '' || 
      sermon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.preacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeries = selectedSeries === 'all' || sermon.series === selectedSeries;
    
    return matchesSearch && matchesSeries;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sermons</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Listen to powerful messages that will strengthen your faith and draw you closer to God
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Series Filter */}
            {series.length > 0 && (
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Series</option>
                {series.map((s, index) => (
                  <option key={index} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredSermons.length === 0 ? (
            <div className="text-center py-12">
              <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No sermons found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try a different search term' : 'Check back later for new sermons'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSermons.map((sermon, index) => (
                <motion.div
                  key={sermon._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Thumbnail */}
                  <Link to={`/sermons/${sermon._id}`} className="block relative h-48 bg-gray-900 group">
                    <img 
                      src={sermon.thumbnail?.startsWith('http') ? sermon.thumbnail : `http://localhost:5000${sermon.thumbnail}`} 
                      alt={sermon.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200/2563eb/ffffff?text=Sermon';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayIcon className="h-12 w-12 text-white" />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <Link to={`/sermons/${sermon._id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-1">
                        {sermon.title}
                      </h3>
                    </Link>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">{sermon.preacher}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-600">{formatSermonDate(sermon.date)}</span>
                      </div>
                      
                      {sermon.series && (
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpenIcon className="h-4 w-4 text-purple-600" />
                          <span className="text-gray-600">Series: {sermon.series}</span>
                        </div>
                      )}
                      
                      {sermon.bibleText && (
                        <div className="text-sm text-gray-600 mt-2 italic">
                          📖 {sermon.bibleText}
                        </div>
                      )}
                    </div>
                    
                    {sermon.description && (
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{sermon.description}</p>
                    )}
                    
                    <Link
                      to={`/sermons/${sermon._id}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Watch Sermon
                      <PlayIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SermonsPage;