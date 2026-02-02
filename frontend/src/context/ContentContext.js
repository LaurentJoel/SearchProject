// src/context/ContentContext.js - STABLE VERSION (NO REFRESH)
import React, { createContext, useState, useContext, useEffect, useCallback, useRef, useMemo } from 'react';
import { contentAPI, healthAPI } from '../services/api';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({
    hero: {}, 
    features: {}, 
    platform: {}, 
    video: {}, 
    future: {}, 
    cta: {},
    welcome_auth: {}, 
    intelligent_search: {}, 
    dashboard_management: {}, 
    advanced_features: {}, 
    secure_reliable: {}, 
    footer: {},
    featuresList: [],
    visionSections: [],
    ctaSections: [],
    platformSections: []
  });
  
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  
  const hasInitialized = useRef(false);
  const isMounted = useRef(true);

  // Stable checkBackendHealth - doesn't change
  const checkBackendHealth = useCallback(async () => {
    try {
      await healthAPI.check();
      if (isMounted.current) {
        setBackendConnected(true);
      }
      return true;
    } catch (err) {
      if (isMounted.current) {
        setBackendConnected(false);
      }
      return false;
    }
  }, []); // No dependencies - stable function

  // Stable fetchContent - doesn't change
  const fetchContent = useCallback(async () => {
    if (!isMounted.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await checkBackendHealth();
      if (!isConnected || !isMounted.current) {
        setLoading(false);
        return;
      }
      
      const [
        sectionsResponse,
        featuresResponse,
        futureResponse,
        ctaResponse,
        platformResponse
      ] = await Promise.all([
        contentAPI.getAll().catch(() => ({ data: [] })),
        contentAPI.getFeatures().catch(() => ({ data: [] })),
        contentAPI.getDynamicSections('future').catch(() => ({ data: [] })),
        contentAPI.getDynamicSections('cta').catch(() => ({ data: [] })),
        contentAPI.getDynamicSections('platform').catch(() => ({ data: [] }))
      ]);
      
      if (!isMounted.current) return;
      
      const newContent = {
        hero: {}, 
        features: {}, 
        platform: {}, 
        video: {}, 
        future: {}, 
        cta: {},
        welcome_auth: {}, 
        intelligent_search: {}, 
        dashboard_management: {}, 
        advanced_features: {}, 
        secure_reliable: {}, 
        footer: {},
        featuresList: [],
        visionSections: [],
        ctaSections: [],
        platformSections: []
      };
      
      if (sectionsResponse.data && Array.isArray(sectionsResponse.data)) {
        sectionsResponse.data.forEach(section => {
          if (section && section.section_key) {
            newContent[section.section_key] = {
              title: section.title || '',
              subtitle: section.subtitle || '',
              content: section.content || '',
              image_url: section.image_url || '',
              video_url: section.video_url || '',
              bullet_points: section.bullet_points || '[]'
            };
          }
        });
      }
      
      if (featuresResponse.data && Array.isArray(featuresResponse.data)) {
        newContent.featuresList = featuresResponse.data
          .filter(f => f && (f.is_active === undefined || f.is_active === true))
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(f => ({
            id: f.id,
            title: f.title || '',
            description: f.description || '',
            icon: f.icon || '✨',
            order: f.order || 0,
            is_active: f.is_active !== false
          }));
      }
      
      if (futureResponse.data && Array.isArray(futureResponse.data)) {
        newContent.visionSections = futureResponse.data
          .filter(v => v && (v.is_active === undefined || v.is_active === true))
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .map(v => ({
            id: v.id,
            title: v.title || '',
            description: v.description || '',
            content: v.content || '',
            icon: v.icon || '✨',
            display_order: v.display_order || 0
          }));
      }
      
      if (ctaResponse.data && Array.isArray(ctaResponse.data)) {
        newContent.ctaSections = ctaResponse.data
          .filter(c => c && (c.is_active === undefined || c.is_active === true))
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .map(c => ({
            id: c.id,
            title: c.title || '',
            description: c.description || '',
            content: c.content || '',
            icon: c.icon || '📢',
            display_order: c.display_order || 0
          }));
      }
      
      if (platformResponse.data && Array.isArray(platformResponse.data)) {
        newContent.platformSections = platformResponse.data
          .filter(p => p && (p.is_active === undefined || p.is_active === true))
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .map(p => ({
            id: p.id,
            title: p.title || '',
            description: p.description || '',
            content: p.content || '',
            icon: p.icon || '🚀',
            display_order: p.display_order || 0
          }));
      }
      
      setContent(newContent);
      setLastUpdated(new Date());
      
    } catch (err) {
      if (isMounted.current) {
        setError('Failed to load content');
        setBackendConnected(false);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [checkBackendHealth]); // Only depends on stable checkBackendHealth

  // Initialize ONCE on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    fetchContent();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchContent]);

  // Stable refreshContent - doesn't change
  const refreshContent = useCallback(() => {
    if (isMounted.current) {
      fetchContent();
    }
  }, [fetchContent]);

  // MEMOIZE the context value to prevent reference changes
  const value = useMemo(() => ({
    content,
    loading,
    error,
    lastUpdated,
    backendConnected,
    refreshContent
  }), [content, loading, error, lastUpdated, backendConnected, refreshContent]);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};