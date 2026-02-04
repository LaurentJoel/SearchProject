// src/services/api.js - FIXED (Working with proxy)
import axios from 'axios';

// Use empty base URL - proxy will handle routing to backend
const API_BASE_URL = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const uploadApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
});

// Helper to determine if URL needs trailing slash based on your Flask routes
const normalizeUrl = (url) => {
  if (!url) return url;
  
  // Remove any existing trailing slash
  let normalized = url.endsWith('/') && url !== '/' ? url.slice(0, -1) : url;
  
  // ONLY /api/content needs trailing slash (the list endpoint)
  if (normalized === '/api/content') {
    return normalized + '/';
  }
  
  // All other endpoints should NOT have trailing slashes
  return normalized;
};

api.interceptors.request.use(
  (config) => {
    // Use 'adminToken' consistently
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Normalize the URL based on Flask route patterns
    if (config.url) {
      config.url = normalizeUrl(config.url);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

uploadApi.interceptors.request.use(
  (config) => {
    // Use 'adminToken' consistently
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Upload endpoints don't need trailing slashes
    if (config.url && config.url.endsWith('/') && config.url !== '/') {
      config.url = config.url.slice(0, -1);
    }
    
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 308 redirects automatically
    if (error.response?.status === 308) {
      const originalUrl = error.config.url;
      const redirectedUrl = error.response.headers.location;
      
      // Extract the path from the redirected URL
      const redirectedPath = redirectedUrl.replace(API_BASE_URL, '');
      
      console.log(`🔄 API redirected from ${originalUrl} to ${redirectedPath}, retrying...`);
      
      // Retry with the redirected URL
      return api.request({
        ...error.config,
        url: redirectedPath
      });
    }
    
    // Handle authentication errors (401) - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname.includes('/admin') && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    
    // Handle 500 errors that might be JWT-related (expired token before backend fix)
    if (error.response?.status === 500) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || '';
      if (errorMsg.toLowerCase().includes('expired') || errorMsg.toLowerCase().includes('token') || errorMsg.toLowerCase().includes('signature')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        if (window.location.pathname.includes('/admin') && !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors (401) - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname.includes('/admin') && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    
    // Handle 500 errors that might be JWT-related
    if (error.response?.status === 500) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || '';
      if (errorMsg.toLowerCase().includes('expired') || errorMsg.toLowerCase().includes('token') || errorMsg.toLowerCase().includes('signature')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        if (window.location.pathname.includes('/admin') && !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    
    // Provide more detailed error message for uploads
    if (error.response) {
      const detail = error.response.data?.detail || error.response.data?.message || 'Upload failed';
      error.message = `Upload error: ${detail} (Status: ${error.response.status})`;
    }
    
    return Promise.reject(error);
  }
);

export const testBackendConnection = async () => {
  try {
    const response = await api.get('/api/health');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const contentAPI = {
  // ALL endpoints need /api prefix
  getAll: () => api.get('/api/content/'),
  getByKey: (sectionKey) => api.get(`/api/content/${sectionKey}`),
  update: (sectionKey, data) => api.put(`/api/content/${sectionKey}`, data),

  getFeatures: () => api.get('/api/content/features'),
  createFeature: (data) => api.post('/api/content/features', data),
  updateFeature: (featureId, data) => api.put(`/api/content/features/${featureId}`, data),
  deleteFeature: (featureId) => api.delete(`/api/content/features/${featureId}`),

  getBullets: (sectionKey) => api.get(`/api/content/${sectionKey}/bullets`),
  updateBullets: (sectionKey, bullets) => api.post(`/api/content/${sectionKey}/bullets`, { bullets }),

  getDynamicSections: (sectionType) => api.get(`/api/content/dynamic-sections?section_type=${sectionType}`),
  createDynamicSection: (data) => api.post('/api/content/dynamic-sections', data),
  updateDynamicSection: (sectionId, data) => api.put(`/api/content/dynamic-sections/${sectionId}`, data),
  deleteDynamicSection: (sectionId) => api.delete(`/api/content/dynamic-sections/${sectionId}`),
};

export const uploadAPI = {
  uploadImage: (file, sectionKey = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (sectionKey) {
      formData.append('section_key', sectionKey);
    }
    return uploadApi.post('/api/upload/image', formData);
  },

  uploadVideo: (file, sectionKey = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (sectionKey) {
      formData.append('section_key', sectionKey);
    }
    return uploadApi.post('/api/upload/video', formData);
  }
};

export const authAPI = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  verify: () => api.get('/api/auth/verify')
};

export const healthAPI = {
  check: () => api.get('/api/health')
};

export const chatAPI = {
  sendMessage: (message, sessionId, language = 'en') =>
    api.post('/api/chat', {
      message,
      session_id: sessionId,
      language
    }),
};

export default api;