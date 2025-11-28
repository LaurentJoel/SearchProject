import React from 'react';
import { CheckCircle, Shield, Search, Workflow, LogIn, Image } from 'lucide-react';

export default function Platform() {
  const platformSections = [
    {
      icon: <LogIn className="w-6 h-6" />,
      title: "Welcome & Authentication",
      description: "Professional login interface with secure access controls and intuitive user experience.",
      features: [
        "Clean, professional welcome screen",
        "Secure authentication system", 
        "Role-based access control",
        "User-friendly interface design"
      ],
      imageName: "welcome-screenshot.jpg"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Intelligent Search Interface", 
      description: "Advanced search functionality with AI-powered document discovery across all formats.",
      features: [
        "Full-text search across all document types",
        "Integrated OCR technology", 
        "Smart bandwidth optimization",
        "Real-time search results"
      ],
      imageName: "search-screenshot.jpg"
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: "Dashboard & Management",
      description: "Comprehensive dashboard for document workflows, progress tracking, and team collaboration.",
      features: [
        "Document workflow management",
        "Real-time progress monitoring",
        "Team collaboration tools",
        "Administrative controls"
      ],
      imageName: "dashboard-screenshot.jpg"
    }
  ];

  // Function to handle image display
  const ImageDisplay = ({ imageName, title, icon }) => {
    const imagePath = `/images/${imageName}`;
    
    return (
      <div className="screenshot-frame aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden relative group">
        {/* Actual Image */}
        <img 
          src={imagePath}
          alt={`${title} - SearchEngine Platform`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        
        {/* Fallback Placeholder */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-8 text-center"
          style={{ display: 'none' }}
        >
          <div className="w-16 h-16 bg-green-200 rounded-2xl mb-4 flex items-center justify-center">
            <Image className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
          <p className="text-gray-600 text-sm mb-3">Add your screenshot to see it here</p>
          <div className="bg-white/80 rounded-lg px-3 py-2 border border-green-200">
            <code className="text-xs text-green-700 font-mono">{imageName}</code>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="platform" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
            Professional Interface
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Platform Experience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Clean, intuitive design built for efficient document management
          </p>
        </div>

        <div className="space-y-20">
          {platformSections.map((section, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-dense' : ''
            }`}>
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{section.title}</h3>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed">{section.description}</p>
                
                <div className="space-y-3">
                  {section.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <ImageDisplay 
                  imageName={section.imageName}
                  title={section.title}
                  icon={section.icon}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}