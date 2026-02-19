import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cog6ToothIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { settingsAPI, authAPI } from '../../services/api';

const AdminSettings = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    churchName: 'Citadel of Power',
    address: 'Watford North, Library St Albans RD, Hertfordshire WD24 7RW, United Kingdom',
    phone: '+(44) 7386-894093',
    email: 'citadelofpowerrccg@gmail.com',
    website: 'https://citadelofpower.org',
    foundedYear: '1990',
    pastorName: 'Pastor John Doe'
  });

  const [profileSettings, setProfileSettings] = useState({
    username: user?.username || '',
    email: user?.email || 'admin@citadelofpower.org',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newContactAlert: true,
    newSermonAlert: false,
    eventReminders: true,
    weeklyReport: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
    fontFamily: 'Inter',
    layout: 'default'
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });

  const tabs = [
    { id: 'general', name: 'General', icon: BuildingOfficeIcon },
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ];

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Update profile when user changes
  useEffect(() => {
    if (user) {
      setProfileSettings(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || 'admin@citadelofpower.org'
      }));
    }
  }, [user]);

  const fetchSettings = async () => {
    setFetchLoading(true);
    try {
      // In a real app, you would fetch these from your API
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock fetched data
      setGeneralSettings({
        churchName: 'Citadel of Power',
        address: 'Watford North, Library St Albans RD, Hertfordshire WD24 7RW, United Kingdom',
        phone: '+(44) 7386-894093',
        email: 'citadelofpowerrccg@gmail.com',
        website: 'https://citadelofpower.org',
        foundedYear: '1990',
        pastorName: 'Pastor John Doe'
      });
      
    } catch (error) {
      console.error('Error fetching settings:', error);
      showError('Failed to load settings');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, you would call your API
      // await settingsAPI.updateGeneral(generalSettings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('General settings updated successfully');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (!password) return { score: 0, message: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    
    const messages = [
      'Very weak',
      'Weak',
      'Fair',
      'Good',
      'Strong'
    ];
    
    return { score, message: messages[score] };
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords if changing
    if (profileSettings.newPassword || profileSettings.currentPassword) {
      if (!profileSettings.currentPassword) {
        showError('Current password is required to change password');
        return;
      }
      
      if (profileSettings.newPassword !== profileSettings.confirmPassword) {
        showError('New passwords do not match');
        return;
      }
      
      if (profileSettings.newPassword.length < 8) {
        showError('New password must be at least 8 characters');
        return;
      }
    }
    
    setLoading(true);
    try {
      // In a real app, you would call your API
      // await settingsAPI.updateProfile(profileSettings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Profile updated successfully');
      setProfileSettings({
        ...profileSettings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength({ score: 0, message: '' });
      
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // await settingsAPI.updateNotifications(notificationSettings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Notification preferences saved');
    } catch (error) {
      showError('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleAppearanceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // await settingsAPI.updateAppearance(appearanceSettings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Appearance settings updated');
      
      // Apply theme changes (example)
      document.documentElement.style.setProperty('--primary-color', appearanceSettings.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', appearanceSettings.secondaryColor);
      
    } catch (error) {
      showError('Failed to update appearance');
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all settings to default values?')) {
      setGeneralSettings({
        churchName: 'Citadel of Power',
        address: 'Watford North, Library St Albans RD, Hertfordshire WD24 7RW, United Kingdom',
        phone: '+(44) 7386-894093',
        email: 'citadelofpowerrccg@gmail.com',
        website: 'https://citadelofpower.org',
        foundedYear: '1990',
        pastorName: 'Pastor John Doe'
      });
      
      setNotificationSettings({
        emailNotifications: true,
        newContactAlert: true,
        newSermonAlert: false,
        eventReminders: true,
        weeklyReport: true
      });
      
      setAppearanceSettings({
        primaryColor: '#2563eb',
        secondaryColor: '#7c3aed',
        fontFamily: 'Inter',
        layout: 'default'
      });
      
      showSuccess('Settings reset to defaults');
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  // Check password strength when new password changes
  useEffect(() => {
    if (profileSettings.newPassword) {
      setPasswordStrength(validatePassword(profileSettings.newPassword));
    } else {
      setPasswordStrength({ score: 0, message: '' });
    }
  }, [profileSettings.newPassword]);

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-1">Manage your church website configuration</p>
        </div>
        <button
          onClick={handleResetToDefaults}
          className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Reset to Defaults
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckIcon className="h-5 w-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fadeIn">
          <XMarkIcon className="h-5 w-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            {/* General Settings */}
            {activeTab === 'general' && (
              <form onSubmit={handleGeneralSubmit}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">General Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Church Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={generalSettings.churchName}
                      onChange={(e) => setGeneralSettings({...generalSettings, churchName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={generalSettings.phone}
                        onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={generalSettings.email}
                        onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={generalSettings.website}
                        onChange={(e) => setGeneralSettings({...generalSettings, website: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Founded Year
                      </label>
                      <input
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        value={generalSettings.foundedYear}
                        onChange={(e) => setGeneralSettings({...generalSettings, foundedYear: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lead Pastor
                    </label>
                    <input
                      type="text"
                      value={generalSettings.pastorName}
                      onChange={(e) => setGeneralSettings({...generalSettings, pastorName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileSettings.username}
                      onChange={(e) => setProfileSettings({...profileSettings, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={profileSettings.currentPassword}
                            onChange={(e) => setProfileSettings({...profileSettings, currentPassword: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showCurrentPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={profileSettings.newPassword}
                            onChange={(e) => setProfileSettings({...profileSettings, newPassword: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                          </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {profileSettings.newPassword && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    passwordStrength.score <= 1 ? 'bg-red-500' :
                                    passwordStrength.score <= 2 ? 'bg-yellow-500' :
                                    passwordStrength.score <= 3 ? 'bg-blue-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                />
                              </div>
                              <span className={`text-xs font-medium ${
                                passwordStrength.score <= 1 ? 'text-red-600' :
                                passwordStrength.score <= 2 ? 'text-yellow-600' :
                                passwordStrength.score <= 3 ? 'text-blue-600' :
                                'text-green-600'
                              }`}>
                                {passwordStrength.message}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Use at least 8 characters with uppercase, lowercase, numbers & symbols
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={profileSettings.confirmPassword}
                            onChange={(e) => setProfileSettings({...profileSettings, confirmPassword: e.target.value})}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                              profileSettings.confirmPassword && profileSettings.newPassword !== profileSettings.confirmPassword
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                          </button>
                        </div>
                        {profileSettings.confirmPassword && profileSettings.newPassword !== profileSettings.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        <span>Update Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleNotificationSubmit}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                          {key === 'newContactAlert' && 'Get alerted when someone contacts you'}
                          {key === 'newSermonAlert' && 'Notify when new sermons are uploaded'}
                          {key === 'eventReminders' && 'Get reminders about upcoming events'}
                          {key === 'weeklyReport' && 'Receive weekly activity summary'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotificationSettings({...notificationSettings, [key]: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        <span>Save Preferences</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <form onSubmit={handleAppearanceSubmit}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Appearance Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                        className="h-10 w-20 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#2563eb"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        value={appearanceSettings.secondaryColor}
                        onChange={(e) => setAppearanceSettings({...appearanceSettings, secondaryColor: e.target.value})}
                        className="h-10 w-20 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={appearanceSettings.secondaryColor}
                        onChange={(e) => setAppearanceSettings({...appearanceSettings, secondaryColor: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#7c3aed"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Family
                    </label>
                    <select
                      value={appearanceSettings.fontFamily}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, fontFamily: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Merriweather">Merriweather</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Layout Style
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['default', 'compact', 'comfortable'].map((layout) => (
                        <button
                          key={layout}
                          type="button"
                          onClick={() => setAppearanceSettings({...appearanceSettings, layout})}
                          className={`p-4 border rounded-lg capitalize transition-all ${
                            appearanceSettings.layout === layout
                              ? 'border-blue-600 bg-blue-50 text-blue-600'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {layout}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
                    <div className="space-y-3">
                      <button 
                        className="px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: appearanceSettings.primaryColor }}
                      >
                        Primary Button
                      </button>
                      <button 
                        className="px-4 py-2 rounded-lg text-white ml-2"
                        style={{ backgroundColor: appearanceSettings.secondaryColor }}
                      >
                        Secondary Button
                      </button>
                      <p style={{ fontFamily: appearanceSettings.fontFamily }} className="mt-2">
                        This is how your text will look with the selected font.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        <span>Save Appearance</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-yellow-700 mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Session Management</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Current Session</p>
                          <p className="text-sm text-gray-600">Started: {new Date().toLocaleString()}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
                      </div>
                    </div>
                    <button className="mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      Log Out All Devices
                    </button>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">API Access</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-3">Your API keys have access to all resources.</p>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        Regenerate API Keys
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium text-red-600 mb-4">Danger Zone</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;