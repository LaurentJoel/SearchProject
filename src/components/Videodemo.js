import React, { useRef, useEffect, useState } from 'react';
import { Play, Zap, Search, Shield, Workflow, Video } from 'lucide-react';

export default function VideoDemo() {
  const videoRef = useRef(null);
  const [videoExists, setVideoExists] = useState(false);

  useEffect(() => {
    // Check if video exists
    fetch('/videos/demo-video.mp4')
      .then(response => {
        if (response.status === 200) {
          setVideoExists(true);
        }
      })
      .catch(() => {
        setVideoExists(false);
      });
  }, []);

  return (
    <section id="video" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-green-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Platform Demonstration
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how SearchEngine transforms document management with intelligent workflows
          </p>
        </div>

        <div className="screenshot-frame bg-white rounded-2xl overflow-hidden">
          {/* Video Area */}
          <div className="aspect-video bg-gradient-to-br from-slate-100 to-green-100 relative">
            {videoExists ? (
              // Video Player - Shows when video exists
              <video 
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                autoPlay
                muted
                poster="/images/video-poster.jpg"
              >
                <source src="/videos/demo-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              // Video Placeholder - Shows when no video
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 flex items-center justify-center group hover:scale-110 transition-transform">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Demo Video</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Add your demo video to showcase the platform's features and user experience
                </p>
                
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 max-w-md">
                  <h4 className="font-semibold text-green-800 mb-3">Add Your Video:</h4>
                  <div className="space-y-2 text-sm text-gray-700 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">1</span>
                      </div>
                      <span>Create folder: <code className="bg-green-100 px-2 py-1 rounded text-green-700">public/videos/</code></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">2</span>
                      </div>
                      <span>Save video as: <code className="bg-green-100 px-2 py-1 rounded text-green-700">demo-video.mp4</code></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">3</span>
                      </div>
                      <span>Video will automatically appear here</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features Showcase */}
          <div className="p-8 bg-white border-t border-green-100">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Smart Search</h5>
                <p className="text-gray-600 text-sm">AI-powered document discovery</p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 bg-green-50 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Workflow className="w-6 h-6 text-green-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Workflows</h5>
                <p className="text-gray-600 text-sm">Automated processes</p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Security</h5>
                <p className="text-gray-600 text-sm">Enterprise-grade protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}