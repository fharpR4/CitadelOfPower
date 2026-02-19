import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  VideoCameraIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  PlayIcon,
  ExclamationCircleIcon,
  LinkIcon,
  CalendarIcon,
  UserIcon,
  BookOpenIcon,
  PhotoIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { sermonAPI } from '../../services/api';

const AdminSermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSermon, setEditingSermon] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    preacher: '',
    date: '',
    description: '',
    videoUrl: '',
    thumbnail: null,
    series: '',
    bibleText: ''
  });
  
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      const response = await sermonAPI.getAll();
      setSermons(response.data.data?.sermons || []);
    } catch (error) {
      console.error('Error fetching sermons:', error);
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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormErrors(prev => ({ 
        ...prev, 
        thumbnail: 'Please select a valid image file (JPEG, PNG, GIF, WebP)' 
      }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({ 
        ...prev, 
        thumbnail: 'Image must be less than 5MB' 
      }));
      return;
    }

    setFormData(prev => ({ ...prev, thumbnail: file }));
    setThumbnailPreview(URL.createObjectURL(file));
    setFormErrors(prev => ({ ...prev, thumbnail: '' }));
    
    console.log('📸 Selected file:', file.name, file.type, file.size);
  };

  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title?.trim()) {
      errors.title = 'Sermon title is required';
    }
    if (!formData.preacher?.trim()) {
      errors.preacher = 'Preacher name is required';
    }
    if (!formData.date) {
      errors.date = 'Sermon date is required';
    }
    if (!formData.videoUrl?.trim()) {
      errors.videoUrl = 'Video URL is required';
    } else if (!isValidUrl(formData.videoUrl)) {
      errors.videoUrl = 'Please enter a valid URL starting with http:// or https://';
    }
    if (!editingSermon && !formData.thumbnail) {
      errors.thumbnail = 'Thumbnail image is required';
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
        preacher: formData.preacher,
        date: formData.date,
        description: formData.description,
        videoUrl: formData.videoUrl,
        series: formData.series,
        bibleText: formData.bibleText,
        thumbnail: formData.thumbnail
      };

      let response;
      
      if (editingSermon) {
        response = await sermonAPI.update(editingSermon._id, dataToSend);
        setSubmitSuccess('✅ Sermon updated successfully!');
      } else {
        response = await sermonAPI.create(dataToSend);
        setSubmitSuccess('✅ Sermon added successfully!');
      }
      
      await fetchSermons();
      
      setTimeout(() => {
        closeModal();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving sermon:', error);
      setSubmitError(
        error.response?.data?.message || 
        'Failed to save sermon. Please check all fields and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (sermon) => {
    setEditingSermon(sermon);
    setFormData({
      title: sermon.title || '',
      preacher: sermon.preacher || '',
      date: sermon.date ? sermon.date.split('T')[0] : '',
      description: sermon.description || '',
      videoUrl: sermon.videoUrl || '',
      thumbnail: null,
      series: sermon.series || '',
      bibleText: sermon.bibleText || ''
    });
    setThumbnailPreview(sermon.thumbnail || '');
    setFormErrors({});
    setSubmitError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sermon? This action cannot be undone.')) {
      return;
    }
    
    try {
      await sermonAPI.delete(id);
      await fetchSermons();
    } catch (error) {
      console.error('Error deleting sermon:', error);
      alert('Failed to delete sermon. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSermon(null);
    setFormData({
      title: '',
      preacher: '',
      date: '',
      description: '',
      videoUrl: '',
      thumbnail: null,
      series: '',
      bibleText: ''
    });
    setThumbnailPreview('');
    setFormErrors({});
    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(false);
  };

  const filteredSermons = sermons.filter(sermon =>
    sermon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.preacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.series?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
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
          <h2 className="text-2xl font-bold text-gray-900">Sermons Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: {sermons.length} sermon{sermons.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sermons..."
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
            Add Sermon
          </button>
        </div>
      </div>

      {/* Sermons Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading sermons...</p>
        </div>
      ) : sermons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Sermons Yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first sermon</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Your First Sermon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon) => (
            <motion.div
              key={sermon._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 bg-gray-900 group">
                {sermon.thumbnail ? (
                  <img 
                    src={sermon.thumbnail.startsWith('http') ? sermon.thumbnail : `http://localhost:5000${sermon.thumbnail}`} 
                    alt={sermon.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200/2563eb/ffffff?text=Sermon';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                    <VideoCameraIcon className="h-16 w-16 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={sermon.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100"
                  >
                    <PlayIcon className="h-5 w-5" />
                    Watch
                  </a>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{sermon.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700 truncate">{sermon.preacher}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600">{formatDate(sermon.date)}</span>
                  </div>
                  
                  {sermon.series && (
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpenIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-600 truncate">Series: {sermon.series}</span>
                    </div>
                  )}
                  
                  {sermon.bibleText && (
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpenIcon className="h-4 w-4 text-green-600" />
                      <span className="text-gray-600">{sermon.bibleText}</span>
                    </div>
                  )}
                </div>
                
                {sermon.description && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{sermon.description}</p>
                )}
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(sermon)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit sermon"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(sermon._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete sermon"
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
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingSermon ? 'Edit Sermon' : 'Add New Sermon'}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {editingSermon ? 'Update sermon details' : 'Share God\'s word with the church'}
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

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <PhotoIcon className="h-5 w-5 text-blue-600" />
                      <span>Thumbnail Image {!editingSermon && <span className="text-red-500">*</span>}</span>
                    </div>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-full sm:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                      {thumbnailPreview ? (
                        <img 
                          src={thumbnailPreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <PhotoIcon className="h-8 w-8 mb-1" />
                          <span className="text-xs">No image selected</span>
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
                          onChange={handleThumbnailChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-500">
                        Recommended: 1280×720px • Max 5MB • JPEG, PNG, GIF, WebP
                      </p>
                      {formErrors.thumbnail && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.thumbnail}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sermon Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., The Power of Faith"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                {/* Preacher & Series */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preacher <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="preacher"
                      value={formData.preacher}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.preacher ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Pastor John Doe"
                    />
                    {formErrors.preacher && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.preacher}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Series
                    </label>
                    <input
                      type="text"
                      name="series"
                      value={formData.series}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Foundations of Faith"
                    />
                  </div>
                </div>

                {/* Date & Bible Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Preached <span className="text-red-500">*</span>
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
                      Bible Text
                    </label>
                    <input
                      type="text"
                      name="bibleText"
                      value={formData.bibleText}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., John 3:16, Ephesians 2:8-9"
                    />
                  </div>
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.videoUrl ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://youtu.be/... or https://drive.google.com/..."
                    />
                  </div>
                  {formErrors.videoUrl ? (
                    <p className="mt-1 text-sm text-red-600">{formErrors.videoUrl}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Any video platform works: YouTube, Google Drive, Vimeo, Dropbox
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the sermon..."
                  />
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
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        <span>{editingSermon ? 'Update Sermon' : 'Add Sermon'}</span>
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

export default AdminSermons;