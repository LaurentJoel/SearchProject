// src/admin/ContentEditor.js - FINAL FIX (Triggers Frontend Refresh)
import React, { useState, useEffect } from 'react';
import { Save, Eye, Upload, Image as ImageIcon, Type, Heading, FileText, AlertCircle, Film } from 'lucide-react';
import { contentAPI, uploadAPI } from '../services/api';
import { useSearchParams } from 'react-router-dom';

const ContentEditor = () => {
  const [searchParams] = useSearchParams();
  const defaultSection = searchParams.get('section') || 'hero';
  
  const sections = [
    { id: 'hero', name: 'Hero Section', icon: '🎯', description: 'Main banner section', supportsVideo: false },
    { id: 'features', name: 'Features Section', icon: '✨', description: 'Features overview', supportsVideo: false },
    { id: 'platform', name: 'Platform Section', icon: '🚀', description: 'Platform main section', supportsVideo: false },
    { id: 'welcome_auth', name: 'Platform Welcome', icon: '🚪', description: 'Welcome interface screenshot', supportsVideo: false },
    { id: 'intelligent_search', name: 'Platform Search', icon: '🔍', description: 'Search interface screenshot', supportsVideo: false },
    { id: 'dashboard_management', name: 'Platform Dashboard', icon: '📊', description: 'Dashboard screenshot', supportsVideo: false },
    { id: 'video', name: 'Video Demo Section', icon: '🎬', description: 'Video demonstration', supportsVideo: true },
    { id: 'future', name: 'Future Section', icon: '🔮', description: 'Future roadmap', supportsVideo: false },
    { id: 'cta', name: 'Call to Action', icon: '📢', description: 'Final call to action', supportsVideo: false },
  ];

  const [activeSection, setActiveSection] = useState(
    sections.find(s => s.id === defaultSection) || sections[0]
  );
  
  const [content, setContent] = useState({
    title: '',
    subtitle: '',
    content: '',
    image_url: '',
    video_url: '',
    bullet_points: '[]'
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await contentAPI.getByKey(activeSection.id);
        if (response.data) {
          setContent({
            title: response.data.title || '',
            subtitle: response.data.subtitle || '',
            content: response.data.content || '',
            image_url: response.data.image_url || '',
            video_url: response.data.video_url || '',
            bullet_points: response.data.bullet_points || '[]'
          });
        }
      } catch (error) {
        console.error(`Error loading ${activeSection.name}:`, error);
        setError(`Failed to load ${activeSection.name}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSection.id]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Not authenticated. Please login again.');
      }
      
      console.log('💾 [ContentEditor] Saving content...');
      await contentAPI.update(activeSection.id, content);
      
      setMessage('✅ Changes saved successfully!');
      console.log('✅ [ContentEditor] Content saved');
      
      // IMPORTANT: Trigger frontend refresh
      console.log('🔄 [ContentEditor] Triggering frontend refresh...');
      window.dispatchEvent(new Event('content-refresh'));
      window.dispatchEvent(new Event('refresh-content'));
      window.postMessage({ type: 'REFRESH_CONTENT' }, '*');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      setMessage(`❌ Error saving changes: ${errorMsg}`);
      setError(errorMsg);
      
      if (error.response?.status === 401) {
        setMessage('❌ Session expired. Please login again.');
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
        }, 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('📤 Uploading image...');
    
    try {
      const response = await uploadAPI.uploadImage(file, activeSection.id);
      const imageUrl = response.data.url;
      
      setContent({ ...content, image_url: imageUrl });
      setMessage('✅ Image uploaded! Click "Save Changes" to apply.');
      
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Upload failed';
      setMessage(`❌ Error uploading image: ${errorMsg}`);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('🎬 Uploading video...');
    
    try {
      const response = await uploadAPI.uploadVideo(file, activeSection.id);
      const videoUrl = response.data.url;
      
      setContent({ ...content, video_url: videoUrl });
      setMessage('✅ Video uploaded! Click "Save Changes" to apply.');
      
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Upload failed';
      setMessage(`❌ Error uploading video: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setError(null);
    const newUrl = `${window.location.pathname}?section=${section.id}`;
    window.history.pushState({}, '', newUrl);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {activeSection.name}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Content Editor</h1>
          <p className="text-gray-600 mt-2">Edit your landing page sections</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-2 px-4 py-2 border border-emerald-300 text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
          >
            <Eye size={18} />
            Preview Website
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.includes('✅') ? (
            <Save className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
              <FileText size={18} className="mr-2" />
              Page Sections
            </h3>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                    activeSection.id === section.id
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <span>{section.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{section.name}</div>
                    <div className="text-xs opacity-80">{section.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              <span className="text-3xl">{activeSection.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-800">{activeSection.name}</h2>
                  <span className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    ID: {activeSection.id}
                  </span>
                </div>
                <p className="text-gray-600">{activeSection.description}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <Heading size={18} className="mr-2" />
                  Title
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent({...content, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter section title"
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <Type size={18} className="mr-2" />
                  Subtitle
                </label>
                <input
                  type="text"
                  value={content.subtitle}
                  onChange={(e) => setContent({...content, subtitle: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter section subtitle"
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <FileText size={18} className="mr-2" />
                  Content
                </label>
                <textarea
                  value={content.content}
                  onChange={(e) => setContent({...content, content: e.target.value})}
                  rows="6"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter detailed content"
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <ImageIcon size={18} className="mr-2" />
                  Image URL
                </label>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={content.image_url}
                    onChange={(e) => setContent({...content, image_url: e.target.value})}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Image URL or upload below"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center gap-2 px-4 py-3 border ${uploading ? 'border-gray-300 text-gray-400' : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'} rounded-lg cursor-pointer whitespace-nowrap transition`}
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          Upload Image
                        </>
                      )}
                    </label>
                  </div>
                </div>
                
                {content.image_url && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600 font-medium">Image Preview:</p>
                      <button
                        onClick={() => setContent({...content, image_url: ''})}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={content.image_url}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {activeSection.supportsVideo && (
                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <Film size={18} className="mr-2" />
                    Video URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={content.video_url}
                      onChange={(e) => setContent({...content, video_url: e.target.value})}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Video URL or upload below"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="video-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="video-upload"
                        className={`flex items-center gap-2 px-4 py-3 border ${uploading ? 'border-gray-300 text-gray-400' : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'} rounded-lg cursor-pointer whitespace-nowrap transition`}
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={18} />
                            Upload Video
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {['welcome_auth', 'intelligent_search', 'dashboard_management'].includes(activeSection.id) && (
                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <FileText size={18} className="mr-2" />
                    Bullet Points (one per line)
                  </label>
                  <textarea
                    value={content.bullet_points ? JSON.parse(content.bullet_points).join('\n') : ''}
                    onChange={(e) => {
                      const bullets = e.target.value.split('\n').filter(b => b.trim() !== '');
                      setContent({...content, bullet_points: JSON.stringify(bullets)});
                    }}
                    rows="6"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter bullet points, one per line"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition disabled:opacity-50 font-medium"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving Changes...
                    </span>
                  ) : uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
