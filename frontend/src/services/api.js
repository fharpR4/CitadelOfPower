import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('🔑 Token from localStorage:', token ? 'exists' : 'not found');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Adding token to request:', config.url);
    } else {
      console.log('⚠️ No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.config?.url, error.response?.status);
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('🚫 Auth error - redirecting to login');
    }
    return Promise.reject(error);
  }
);

// ============================================
// WORKERS API - FIXED VERSION
// ============================================
export const workerAPI = {
  getAll: (params) => api.get('/workers', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  
  create: (data) => {
    console.log('📦 Creating worker with data:', data);
    
    const formData = new FormData();
    
    // Append all fields explicitly
    if (data.name) formData.append('name', data.name);
    if (data.role) formData.append('role', data.role);
    if (data.unit) formData.append('unit', data.unit);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.bio) formData.append('bio', data.bio);
    
    // Handle file upload
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
      console.log('📸 Image file appended:', data.image.name);
    }
    
    // Log FormData contents
    console.log('📤 FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (key === 'image') {
        console.log(`   - ${key}: [FILE] ${value.name} (${value.type})`);
      } else {
        console.log(`   - ${key}: ${value}`);
      }
    }
    
    return api.post('/workers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  update: (id, data) => {
    console.log('📦 Updating worker:', id, data);
    
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.role) formData.append('role', data.role);
    if (data.unit) formData.append('unit', data.unit);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.bio) formData.append('bio', data.bio);
    
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
      console.log('📸 New image file appended');
    }
    
    return api.put(`/workers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  delete: (id) => api.delete(`/workers/${id}`),
};

// ============================================
// SERMONS API - COMPLETELY REWRITTEN
// ============================================
export const sermonAPI = {
  getAll: (params) => api.get('/sermons', { params }),
  getRecent: (limit = 3) => api.get('/sermons?limit=' + limit + '&sort=-date'),
  getById: (id) => api.get(`/sermons/${id}`),
  
  create: (data) => {
    console.log('📦 Creating sermon with data:', data);
    
    const formData = new FormData();
    
    // Explicitly append each field (more reliable than Object.keys)
    if (data.title) formData.append('title', data.title);
    if (data.preacher) formData.append('preacher', data.preacher);
    if (data.date) formData.append('date', data.date);
    if (data.description) formData.append('description', data.description);
    if (data.videoUrl) formData.append('videoUrl', data.videoUrl);
    if (data.series) formData.append('series', data.series);
    if (data.bibleText) formData.append('bibleText', data.bibleText);
    
    // Handle file upload
    if (data.thumbnail && data.thumbnail instanceof File) {
      formData.append('thumbnail', data.thumbnail);
      console.log('📸 Thumbnail file appended:', data.thumbnail.name);
    } else if (data.thumbnail) {
      console.warn('⚠️ thumbnail is not a File object:', typeof data.thumbnail);
    }
    
    // Log FormData contents
    console.log('📤 FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (key === 'thumbnail') {
        console.log(`   - ${key}: [FILE] ${value.name} (${value.type})`);
      } else {
        console.log(`   - ${key}: ${value}`);
      }
    }
    
    return api.post('/sermons', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  update: (id, data) => {
    console.log('📦 Updating sermon:', id, data);
    
    const formData = new FormData();
    
    if (data.title) formData.append('title', data.title);
    if (data.preacher) formData.append('preacher', data.preacher);
    if (data.date) formData.append('date', data.date);
    if (data.description) formData.append('description', data.description);
    if (data.videoUrl) formData.append('videoUrl', data.videoUrl);
    if (data.series) formData.append('series', data.series);
    if (data.bibleText) formData.append('bibleText', data.bibleText);
    
    if (data.thumbnail && data.thumbnail instanceof File) {
      formData.append('thumbnail', data.thumbnail);
      console.log('📸 New thumbnail file appended');
    }
    
    return api.put(`/sermons/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  delete: (id) => api.delete(`/sermons/${id}`),
};

// ============================================
// EVENTS API - COMPLETELY FIXED
// ============================================
export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getUpcoming: () => api.get('/events/upcoming'),
  getById: (id) => api.get(`/events/${id}`),
  
  create: (data) => {
    console.log('📦 Creating event with data:', data);
    
    const formData = new FormData();
    
    // CRITICAL: Append ALL fields explicitly
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.date) formData.append('date', data.date);
    if (data.time) formData.append('time', data.time);
    if (data.venue) formData.append('venue', data.venue);
    if (data.category) formData.append('category', data.category);
    
    // Boolean fields - always send even if false
    formData.append('registrationRequired', data.registrationRequired ? 'true' : 'false');
    
    if (data.maxAttendees) {
      formData.append('maxAttendees', data.maxAttendees.toString());
    }
    
    // Handle file upload
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
      console.log('📸 Image file appended:', data.image.name);
    } else {
      console.warn('⚠️ No image file provided');
    }
    
    // Log all form data for debugging
    console.log('📤 FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (key === 'image') {
        console.log(`   - ${key}: [FILE] ${value.name} (${value.type})`);
      } else {
        console.log(`   - ${key}: ${value}`);
      }
    }
    
    return api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  update: (id, data) => {
    console.log('📦 Updating event:', id, data);
    
    const formData = new FormData();
    
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.date) formData.append('date', data.date);
    if (data.time) formData.append('time', data.time);
    if (data.venue) formData.append('venue', data.venue);
    if (data.category) formData.append('category', data.category);
    
    formData.append('registrationRequired', data.registrationRequired ? 'true' : 'false');
    
    if (data.maxAttendees) {
      formData.append('maxAttendees', data.maxAttendees.toString());
    }
    
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
      console.log('📸 New image file appended');
    }
    
    return api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  delete: (id) => api.delete(`/events/${id}`),
};

// ============================================
// CONTACT API
// ============================================
export const contactAPI = {
  getAll: () => api.get('/contact'),
  getById: (id) => api.get(`/contact/${id}`),
  create: (data) => api.post('/contact', data),
  update: (id, data) => api.put(`/contact/${id}`, data),
  delete: (id) => api.delete(`/contact/${id}`),
};

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// ============================================
// SETTINGS API
// ============================================
export const settingsAPI = {
  updateGeneral: (data) => api.put('/settings/general', data),
  updateProfile: (data) => api.put('/settings/profile', data),
  updateNotifications: (data) => api.put('/settings/notifications', data),
  updateAppearance: (data) => api.put('/settings/appearance', data),
};

export default api;