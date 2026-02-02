// src/App.js - FIXED
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoDemo from './components/Videodemo';
import Features from './components/Features';
import Platform from './components/platform';
import Future from './components/Future';
import CTA from './components/CTA';
import Chatbot from './components/Chatbot';
import { LanguageProvider } from './context/LanguageContext';
import { ContentProvider } from './context/ContentContext';
import './index.css';

// Admin Components
const AdminLogin = React.lazy(() => import('./admin/AdminLogin'));
const AdminLayout = React.lazy(() => import('./admin/AdminLayout'));
const Dashboard = React.lazy(() => import('./admin/Dashboard'));
const ContentEditor = React.lazy(() => import('./admin/ContentEditor'));
const FeaturesEditor = React.lazy(() => import('./admin/FeaturesEditor'));
const SectionBulletEditor = React.lazy(() => import('./admin/SectionBulletEditor'));
const VisionSectionsEditor = React.lazy(() => import('./admin/VisionSectionsEditor'));
const CTASectionsEditor = React.lazy(() => import('./admin/CTASectionsEditor'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" />;
};

// Loading component
const AdminLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
      <p className="mt-4 text-emerald-600">Loading Admin Panel...</p>
    </div>
  </div>
);

// Main Landing Page Component
const LandingPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 overflow-x-hidden">
        <Header />
        <Hero />
        <VideoDemo />
        <Features />
        <Platform />
        <Future />
        <CTA />
      </div>
      <Chatbot />
    </>
  );
};

function App() {
  const isMounted = useRef(false);
  
  useEffect(() => {
    console.log('🚀 App mounted at:', new Date().toLocaleTimeString());
    isMounted.current = true;
    
    // Block beforeunload
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      isMounted.current = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return (
    <LanguageProvider>
      <ContentProvider>
        <Router>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/login" 
              element={
                <React.Suspense fallback={<AdminLoading />}>
                  <AdminLogin />
                </React.Suspense>
              } 
            />
            
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<AdminLoading />}>
                    <AdminLayout />
                  </React.Suspense>
                </ProtectedRoute>
              }
            >
              {/* Nested admin routes */}
              <Route index element={
                <React.Suspense fallback={<AdminLoading />}>
                  <Dashboard />
                </React.Suspense>
              } />
              <Route path="content" element={
                <React.Suspense fallback={<AdminLoading />}>
                  <ContentEditor />
                </React.Suspense>
              } />
              <Route path="sections" element={
                <React.Suspense fallback={<AdminLoading />}>
                  <SectionBulletEditor />
                </React.Suspense>
              } />
              <Route path="features" element={
                <React.Suspense fallback={<AdminLoading />}>
                  <FeaturesEditor />
                </React.Suspense>
              } />
              <Route path="vision" element={
                <React.Suspense fallback={<AdminLoading />}>
                  <VisionSectionsEditor />
                </React.Suspense>
              } />
              <Route path="cta" element={
                <React.Suspense fallback={<AdminLoading />}>
                  <CTASectionsEditor />
                </React.Suspense>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ContentProvider>
    </LanguageProvider>
  );
}

export default App;