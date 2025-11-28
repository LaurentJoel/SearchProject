import React from 'react';
import { Search, Zap, Workflow, Shield, FileText, Users } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "AI-Powered Search",
      description: "Intelligent full-text search across all document types with integrated OCR technology",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Bandwidth Optimized",
      description: "Smart segmentation delivers only relevant pages, reducing data transfer significantly",
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: "Workflow Automation",
      description: "Customizable BPM engine for document validation and approval processes",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "JWT authentication, hierarchical roles, and granular RBAC permissions",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Document Management",
      description: "Complete document lifecycle management with metadata and version control",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Seamless collaboration with comments, digital signatures, and real-time tracking",
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Enterprise-Grade Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive document management solution designed for modern administration needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-8 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}