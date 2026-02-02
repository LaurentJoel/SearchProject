// src/utils/backend.js - UPDATED VERSION
// Smart backend URL detection for images
export const getBackendBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  }
  
  const { hostname, port, protocol } = window.location;
  
  // Development mode (React dev server)
  if (hostname === 'localhost' && port === '3000') {
    return process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  }
  
  // Docker/Production mode (port 80)
  if (hostname === 'localhost' && (port === '80' || port === '')) {
    return 'http://localhost'; // Nginx serves uploads
  }
  
  // Default
  return process.env.REACT_APP_BACKEND_URL || window.location.origin;
};

/**
 * Get full URL for backend resources (images, videos, etc.)
 * This handles both Docker and local development
 */
export const getBackendResourceUrl = (path) => {
  if (!path) return null;
  
  // Already a full URL (http:// or https://)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Already a full URL (//)
  if (path.startsWith('//')) {
    return window.location.protocol + path;
  }
  
  // If it starts with /uploads, we need to handle it specially
  if (path.startsWith('/uploads/')) {
    const backendBaseUrl = getBackendBaseUrl();
    
    // For local development, backend runs on port 5000
    if (backendBaseUrl.includes('localhost:5000')) {
      return `${backendBaseUrl}${path}`;
    }
    
    // For Docker/Production, nginx proxies /uploads to backend
    // So we use the current origin
    return path; // Keep as relative path - nginx will handle it
  }
  
  // For other paths that don't start with /uploads
  if (path.startsWith('/')) {
    const backendBaseUrl = getBackendBaseUrl();
    return `${backendBaseUrl}${path}`;
  }
  
  // Just a filename, assume it's in uploads
  const backendBaseUrl = getBackendBaseUrl();
  if (backendBaseUrl.includes('localhost:5000')) {
    return `${backendBaseUrl}/uploads/${path}`;
  }
  
  return `/uploads/${path}`;
};

/**
 * Extract filename from path
 */
export const getFilenameFromPath = (path) => {
  if (!path) return '';
  return path.split('/').pop();
};

/**
 * Check if an image URL is accessible
 */
export const checkImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Default fallback images by section
 */
export const FALLBACK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  welcome: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
  search: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
  dashboard: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  security: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
  ocr: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
  video_demo: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
  default: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
};

export const getImageFallback = (section) => {
  return FALLBACK_IMAGES[section] || FALLBACK_IMAGES.default;
};