// src/utils/imageUtils.js - UPDATED
export const preloadImages = (imageUrls) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return Promise.resolve();
  }
  
  return Promise.all(
    imageUrls
      .filter(url => url && typeof url === 'string')
      .map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = () => {
            console.warn(`Failed to load image: ${url}`);
            resolve(); // Resolve anyway to continue
          };
        });
      })
  );
};

export const getImageFallback = (section) => {
  // Return local fallback images instead of external URLs
  const fallbacks = {
    welcome: "/fallback-welcome.svg",
    search: "/fallback-search.svg", 
    dashboard: "/fallback-dashboard.svg",
    hero: "/fallback-hero.svg",
    features: "/fallback-features.svg",
    platform: "/fallback-platform.svg",
    video: "/fallback-video.svg",
    future: "/fallback-future.svg",
    cta: "/fallback-cta.svg",
    default: "/fallback-default.svg"
  };
  
  return fallbacks[section] || fallbacks.default;
};

export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return getImageFallback('default');
  
  // If it's an external URL, leave it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.includes('unsplash')) {
      const { width = 800, quality = 80 } = options;
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
    }
    return url;
  }
  
  // If it's a local uploaded file
  if (url.startsWith('/uploads/')) {
    return url; // Use as-is, nginx will serve it
  }
  
  // If it's just a filename
  if (url.includes('.') && !url.includes('/')) {
    return `/uploads/${url}`;
  }
  
  // Default fallback
  return getImageFallback('default');
};

// New function to handle uploaded images specifically
export const getUploadedImageUrl = (filename) => {
  if (!filename) return getImageFallback('default');
  
  // If already a full URL or path
  if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('/')) {
    return filename;
  }
  
  // If it's just a filename, prepend /uploads/
  return `/uploads/${filename}`;
};

// New function to get video URL
export const getVideoUrl = (filename) => {
  if (!filename) return null;
  
  // If already a full URL or path
  if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('/')) {
    return filename;
  }
  
  // If it's just a filename, prepend /uploads/
  return `/uploads/${filename}`;
};

// New function to check if image exists
export const checkImageExists = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
