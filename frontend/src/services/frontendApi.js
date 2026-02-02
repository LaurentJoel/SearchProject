// src/services/frontendApi.js - SIMPLIFIED FOR FRONTEND USE
import { contentAPI, healthAPI, chatAPI } from './api';

// Public API functions for frontend
export const publicAPI = {
  // Chat
  sendMessage: (message, sessionId, language = 'en') => 
    chatAPI.sendMessage(message, sessionId, language),
  
  // Content - use correct endpoints with/without slashes
  getContent: () => contentAPI.getAll(),
  getContentByKey: (sectionKey) => contentAPI.getByKey(sectionKey),
  getFeatures: () => contentAPI.getFeatures(),
  getDynamicSections: (sectionType) => contentAPI.getDynamicSections(sectionType),
  
  // Health
  checkHealth: () => healthAPI.check()
};

// Helper to fetch all landing page content
export const fetchLandingContent = async () => {
  try {
    const [contentRes, featuresRes] = await Promise.all([
      publicAPI.getContent(),
      publicAPI.getFeatures()
    ]);
    
    return {
      success: true,
      content: contentRes.data || [],
      features: featuresRes.data || [],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching landing content:', error);
    return {
      success: false,
      content: [],
      features: [],
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

export default publicAPI;
