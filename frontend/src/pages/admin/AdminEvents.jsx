import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  ClockIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { eventAPI } from '../../services/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    registrationRequired: false,
    maxAttendees: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState('');

  const categories = [
    'Sunday Service',
    'Bible Study', 
    'Prayer Meeting',
    'Conference',
    'Outreach',
    'Fellowship',
    'Other'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      setEvents(response.data.data?.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
    
    if (!formData.title?.trim()) {
      errors.title = 'Event title is required';
    }
    if (!formData.description?.trim()) {
      errors.description = 'Event description is required';
    }
    if (!formData.date) {
      errors.date = 'Event date is required';
    }
    if (!formData.venue?.trim()) {
      errors.venue = 'Venue is required';
    }
    if (!editingEvent && !formData.image) {
      errors.image = 'Event image is required';
    }
    if (formData.registrationRequired && formData.maxAttendees) {
      const max = parseInt(formData.maxAttendees);
      if (isNaN(max) || max < 1) {
        errors.maxAttendees = 'Please enter a valid number';
      }
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
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        category: formData.category,
        registrationRequired: formData.registrationRequired,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        image: formData.image
      };

      let response;
      
      if (editingEvent) {
        response = await eventAPI.update(editingEvent._id, dataToSend);
        setSubmitSuccess('✅ Event updated successfully!');
      } else {
        response = await eventAPI.create(dataToSend);
        setSubmitSuccess('✅ Event added successfully!');
      }
      
      await fetchEvents();
      
      setTimeout(() => {
        closeModal();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving event:', error);
      setSubmitError(
        error.response?.data?.message || 
        'Failed to save event. Please check all fields and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date ? event.date.split('T')[0] : '',
      time: event.time || '',
      venue: event.venue || '',
      category: event.category || '',
      registrationRequired: event.registrationRequired || false,
      maxAttendees: event.maxAttendees || '',
      image: null
    });
    setImagePreview(event.image || '');
    setFormErrors({});
    setSubmitError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      await eventAPI.delete(id);
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      category: '',
      registrationRequired: false,
      maxAttendees: '',
      image: null
    });
    setImagePreview('');
    setFormErrors({});
    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(false);
  };

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date TBD';
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: {events.length} event{events.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
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
            Add Event
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first event</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {/* Event Image */}
                <div className="md:w-64 h-48 md:h-auto bg-gray-200">
                  {event.image ? (
                    <img 
                      src={event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300/2563eb/ffffff?text=Event';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                      <CalendarIcon className="h-16 w-16 text-blue-400" />
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <ClockIcon className="h-5 w-5 text-blue-600" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPinIcon className="h-5 w-5 text-blue-600" />
                          <span>{event.venue}</span>
                        </div>
                        {event.category && (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {event.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {event.registrationRequired && (
                        <p className="mt-3 text-sm text-green-600 flex items-center gap-1">
                          <UserGroupIcon className="h-4 w-4" />
                          Registration Required • Max: {event.maxAttendees || 'Unlimited'}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
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
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 border-b bg-gradient-to-r from-green-600 to-blue-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </h3>
                  <p className="text-green-100 text-sm mt-1">
                    {editingEvent ? 'Update event details' : 'Create a new church event'}
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
                <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
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
                      <PhotoIcon className="h-5 w-5 text-green-600" />
                      <span>Event Image {!editingEvent && <span className="text-red-500">*</span>}</span>
                    </div>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-full sm:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <PhotoIcon className="h-8 w-8 mb-1" />
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
                        Recommended: 1200×800px • Max 5MB • JPEG, PNG, GIF, WebP
                      </p>
                      {formErrors.image && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.image}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Sunday Worship Service"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.date && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Venue & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venue <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.venue ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Main Sanctuary"
                    />
                    {formErrors.venue && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.venue}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Registration Options */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="registrationRequired"
                      id="registrationRequired"
                      checked={formData.registrationRequired}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="registrationRequired" className="text-sm text-gray-700">
                      Registration Required
                    </label>
                  </div>

                  {formData.registrationRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Attendees (optional)
                      </label>
                      <input
                        type="number"
                        name="maxAttendees"
                        value={formData.maxAttendees}
                        onChange={handleInputChange}
                        min="1"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.maxAttendees ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Leave empty for unlimited"
                      />
                      {formErrors.maxAttendees && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.maxAttendees}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Event description..."
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                  )}
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
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        <span>{editingEvent ? 'Update Event' : 'Add Event'}</span>
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

export default AdminEvents;