import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  BriefcaseIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { workerAPI } from '../../services/api';

const AdminWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    unit: '',
    email: '',
    phone: '',
    bio: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await workerAPI.getAll();
      setWorkers(response.data.data?.workers || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormErrors(prev => ({ 
        ...prev, 
        image: 'Please select a valid image file (JPEG, PNG, GIF, WebP)' 
      }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({ 
        ...prev, 
        image: 'Image must be less than 5MB' 
      }));
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
    setFormErrors(prev => ({ ...prev, image: '' }));
    
    console.log('📸 Selected image:', file.name, file.type, file.size);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Full name is required';
    }
    if (!formData.role?.trim()) {
      errors.role = 'Role/Position is required';
    }
    if (!formData.unit?.trim()) {
      errors.unit = 'Unit/Department is required';
    }
    
    // Email validation (optional but must be valid if provided)
    if (formData.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional)
    if (formData.phone && !/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSend = {
        name: formData.name,
        role: formData.role,
        unit: formData.unit,
        email: formData.email || '',
        phone: formData.phone || '',
        bio: formData.bio || '',
        image: formData.image
      };

      let response;
      
      if (editingWorker) {
        response = await workerAPI.update(editingWorker._id, dataToSend);
        setSubmitSuccess('✅ Worker updated successfully!');
      } else {
        response = await workerAPI.create(dataToSend);
        setSubmitSuccess('✅ Worker added successfully!');
      }
      
      await fetchWorkers();
      
      setTimeout(() => {
        closeModal();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving worker:', error);
      setSubmitError(
        error.response?.data?.message || 
        'Failed to save worker. Please check all fields and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name || '',
      role: worker.role || '',
      unit: worker.unit || '',
      email: worker.email || '',
      phone: worker.phone || '',
      bio: worker.bio || '',
      image: null
    });
    setImagePreview(worker.image || '');
    setFormErrors({});
    setSubmitError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this worker? This action cannot be undone.')) {
      return;
    }
    
    try {
      await workerAPI.delete(id);
      await fetchWorkers();
    } catch (error) {
      console.error('Error deleting worker:', error);
      alert('Failed to delete worker. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingWorker(null);
    setFormData({
      name: '',
      role: '',
      unit: '',
      email: '',
      phone: '',
      bio: '',
      image: null
    });
    setImagePreview('');
    setFormErrors({});
    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(false);
  };

  const filteredWorkers = workers.filter(worker =>
    worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.unit?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workers Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: {workers.length} worker{workers.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
            />
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Worker
          </button>
        </div>
      </div>

      {/* Workers Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading workers...</p>
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Workers Yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first church worker</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Your First Worker
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker, index) => (
            <motion.div
              key={worker._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 overflow-hidden bg-gray-200 relative group">
                {worker.image ? (
                  <img 
                    src={worker.image.startsWith('http') ? worker.image : `http://localhost:5000${worker.image}`} 
                    alt={worker.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300/2563eb/ffffff?text=Worker';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                    <UserGroupIcon className="h-16 w-16 text-blue-400" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{worker.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <BriefcaseIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700 font-medium">{worker.role}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <BuildingOfficeIcon className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-600">{worker.unit}</span>
                  </div>
                  
                  {worker.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <EnvelopeIcon className="h-4 w-4 text-green-600" />
                      <a href={`mailto:${worker.email}`} className="text-gray-600 hover:text-blue-600">
                        {worker.email}
                      </a>
                    </div>
                  )}
                  
                  {worker.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="h-4 w-4 text-green-600" />
                      <a href={`tel:${worker.phone}`} className="text-gray-600 hover:text-blue-600">
                        {worker.phone}
                      </a>
                    </div>
                  )}
                </div>
                
                {worker.bio && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{worker.bio}</p>
                )}
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(worker)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(worker._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingWorker ? 'Edit Worker' : 'Add New Worker'}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {editingWorker ? 'Update worker information' : 'Add a new church worker'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            {/* Success/Error Messages */}
            {submitSuccess && (
              <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span>{submitSuccess}</span>
              </div>
            )}
            
            {submitError && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                <span>{submitError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <PhotoIcon className="h-5 w-5 text-blue-600" />
                      <span>Profile Image</span>
                    </div>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <UserIcon className="h-8 w-8 mb-1" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="relative cursor-pointer bg-white rounded-lg border border-gray-300 hover:bg-gray-50 px-4 py-2 inline-flex items-center gap-2">
                        <ArrowUpTrayIcon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm text-gray-700">Choose Image</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-500">
                        Optional • Max 5MB • JPEG, PNG, GIF, WebP
                      </p>
                      {formErrors.image && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.image}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., John Doe"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Role & Unit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role/Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.role ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Pastor, Usher, Choir"
                    />
                    {formErrors.role && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit/Department <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.unit ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Music, Media, Ushering"
                    />
                    {formErrors.unit && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.unit}</p>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+1234567890"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biography
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description about the worker..."
                  />
                </div>

                {/* Required Fields Note */}
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <span>Fields marked with <span className="text-red-500">*</span> are required</span>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        <span>{editingWorker ? 'Update Worker' : 'Add Worker'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkers;