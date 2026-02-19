import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { workerAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const WorkersPage = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const units = [
    'All', 'Choir', 'Usher', 'Sanitation', 'Prayer', 
    'Media', 'Protocol', 'Pastor', 'Deacon', 'Evangelism', 'Children', 'Technical'
  ];

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    if (selectedUnit === 'All') {
      setFilteredWorkers(workers);
    } else {
      setFilteredWorkers(workers.filter(worker => worker.unit === selectedUnit));
    }
  }, [selectedUnit, workers]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await workerAPI.getAll();
      setWorkers(response.data.data.workers);
      setFilteredWorkers(response.data.data.workers);
    } catch (err) {
      setError('Failed to load workers. Please try again later.');
      console.error('Error fetching workers:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;

  return (
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Dedicated Workers
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Meet the wonderful people who serve in various capacities within our church.
          Each unit plays a vital role in our ministry.
        </p>
      </motion.div>

      {/* Unit Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {units.map((unit) => (
          <button
            key={unit}
            onClick={() => setSelectedUnit(unit)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedUnit === unit
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {unit}
          </button>
        ))}
      </div>

      {/* Workers Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
      >
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map((worker, index) => (
            <motion.div
              key={worker._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card overflow-hidden"
            >
              <div className="aspect-square overflow-hidden bg-gray-200">
                <img
                  src={worker.imageUrl || '/default-avatar.png'}
                  alt={worker.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{worker.name}</h3>
                <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded">
                  {worker.unit}
                </span>
                {worker.role && (
                  <p className="text-sm text-gray-600 mt-2">{worker.role}</p>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No workers found in this unit.</p>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold">{workers.length}</div>
            <div className="text-primary-100">Total Workers</div>
          </div>
          <div>
            <div className="text-4xl font-bold">
              {workers.filter(w => w.unit === 'Choir').length}
            </div>
            <div className="text-primary-100">Choir Members</div>
          </div>
          <div>
            <div className="text-4xl font-bold">
              {workers.filter(w => w.unit === 'Usher').length}
            </div>
            <div className="text-primary-100">Ushering Team</div>
          </div>
          <div>
            <div className="text-4xl font-bold">
              {new Set(workers.map(w => w.unit)).size}
            </div>
            <div className="text-primary-100">Active Units</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkersPage;