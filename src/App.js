import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoDemo from './components/Videodemo';
import Features from './components/Features';
import Platform from './components/platform';
import Future from './components/Future';
import CTA from './components/CTA';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-25 via-green-50 to-emerald-50">
        <Header />
        <Hero />
        <VideoDemo />
        <Features />
        <Platform />
        <Future />
        <CTA />
      </div>
    </LanguageProvider>
  );
}

export default App;