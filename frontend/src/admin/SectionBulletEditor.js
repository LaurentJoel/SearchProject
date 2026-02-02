// src/admin/SectionBulletEditor.js - UPDATED (Removed Advanced Features & Secure)
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Save, Check, X, List, 
  CheckCircle, Circle, RefreshCw, AlertCircle 
} from 'lucide-react';
import { contentAPI } from '../services/api';

const SectionBulletEditor = () => {
  // REMOVED: 'advanced_features' and 'secure_reliable'
  const sections = [
    { id: 'welcome_auth', name: 'Welcome & Authentication', icon: '🔐' },
    { id: 'intelligent_search', name: 'Intelligent Search Interface', icon: '🔍' },
    { id: 'dashboard_management', name: 'Dashboard & Management', icon: '📊' },
    { id: 'footer', name: 'Footer/Copyright', icon: '©️' }
    // Removed: 'advanced_features', 'secure_reliable'
  ];

  const [activeSection, setActiveSection] = useState(sections[0]);
  const [sectionContent, setSectionContent] = useState({
    title: '',
    subtitle: '',
    content: ''
  });
  const [bullets, setBullets] = useState([]);
  const [newBullet, setNewBullet] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSectionData();
  }, [activeSection.id]);

  const fetchSectionData = async () => {
    setLoading(true);
    try {
      // Fetch section content
      const contentRes = await contentAPI.getByKey(activeSection.id);
      
      // Check if response is successful (2xx status)
      if (contentRes.status >= 200 && contentRes.status < 300) {
        const data = contentRes.data || {};
        
        setSectionContent({
          title: data.title || '',
          subtitle: data.subtitle || '',
          content: data.content || ''
        });
        
        // Parse bullet points
        try {
          const bulletJson = data.bullet_points || '[]';
          const parsedBullets = JSON.parse(bulletJson);
          
          if (Array.isArray(parsedBullets)) {
            const formattedBullets = parsedBullets
              .filter(bullet => bullet !== null && bullet !== undefined)
              .map(bullet => {
                if (typeof bullet === 'string') {
                  return { text: bullet, checked: false };
                } else if (bullet && typeof bullet === 'object') {
                  return {
                    text: bullet.text || bullet.bullet_text || '',
                    checked: bullet.checked || bullet.is_checked || false
                  };
                } else {
                  return { text: String(bullet), checked: false };
                }
              });
            
            setBullets(formattedBullets);
          } else {
            setBullets([]);
          }
        } catch (error) {
          console.error('Error parsing bullet points:', error);
          setBullets([]);
        }
      } else {
        // If API returns error, set empty data
        setSectionContent({
          title: '',
          subtitle: '',
          content: ''
        });
        setBullets([]);
      }
      
    } catch (error) {
      console.error('Error fetching section:', error);
      
      // Set empty data on error
      setSectionContent({
        title: '',
        subtitle: '',
        content: ''
      });
      setBullets([]);
      
      // Only show error if it's not a 404
      if (error.response?.status !== 404) {
        setMessage('❌ Failed to load section data');
      } else {
        setMessage('ℹ️ Section not found - you can create it now');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddBullet = () => {
    if (newBullet.trim()) {
      setBullets([...bullets, { text: newBullet.trim(), checked: false }]);
      setNewBullet('');
    }
  };

  const handleRemoveBullet = (index) => {
    const newBullets = bullets.filter((_, i) => i !== index);
    setBullets(newBullets);
  };

  const handleToggleCheck = (index) => {
    const newBullets = [...bullets];
    if (newBullets[index]) {
      newBullets[index].checked = !newBullets[index].checked;
      setBullets(newBullets);
    }
  };

  // In SectionBulletEditor.js, update the handleSave function:
const handleSave = async () => {
  setSaving(true);
  setMessage('');
  
  try {
    // Extract just the text for saving
    const bulletTexts = bullets
      .filter(bullet => bullet && bullet.text)
      .map(bullet => bullet.text);
    
    // Prepare data
    const dataToSave = {
      ...sectionContent,
      bullet_points: JSON.stringify(bulletTexts)
    };
    
    // Save section content
    await contentAPI.update(activeSection.id, dataToSave);
    
    setMessage('✅ Changes saved successfully!');
    
    // FORCE FRONTEND REFRESH - MULTIPLE METHODS
    console.log('🔄 Forcing frontend refresh...');
    
    // Method 1: Custom event
    window.dispatchEvent(new CustomEvent('content-refresh'));
    
    // Method 2: Post message
    window.postMessage({ 
      type: 'REFRESH_CONTENT',
      section: activeSection.id,
      timestamp: Date.now()
    }, '*');
    
    // Method 3: Local storage event (works across tabs)
    localStorage.setItem('content-updated', JSON.stringify({
      section: activeSection.id,
      timestamp: Date.now()
    }));
    
    // Method 4: Direct API call to refresh context
    if (window.refreshContentContext) {
      window.refreshContentContext();
    }
    
    // Method 5: Open frontend in new tab to see changes
    setTimeout(() => {
      window.open('/', '_blank');
    }, 1000);
    
    setTimeout(() => setMessage(''), 3000);
  } catch (error) {
    console.error('Save error:', error);
    setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
  } finally {
    setSaving(false);
  }
};

  const handleMoveBullet = (index, direction) => {
    if (!bullets[index]) return;
    
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === bullets.length - 1)) {
      return;
    }
    
    const newBullets = [...bullets];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBullets[index], newBullets[newIndex]] = [newBullets[newIndex], newBullets[index]];
    setBullets(newBullets);
  };

  // Validate bullets array to ensure no null items
  const safeBullets = bullets.filter(bullet => bullet !== null && bullet !== undefined);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Section Content Editor</h1>
          <p className="text-gray-600 mt-2">Edit section titles, subtitles, and bullet points</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchSectionData}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.includes('✅') ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          <span>{message}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
              <List className="mr-2" />
              Sections
            </h3>
            <div className="space-y-2">
              {sections.map((section) => {
                const isActive = activeSection.id === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section)}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 ${
                      isActive
                        ? 'bg-emerald-500 text-white'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span className="font-medium">{section.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{activeSection.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{activeSection.name}</h2>
                <p className="text-gray-600">Edit section content</p>
              </div>
            </div>

            {/* Section Content */}
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={sectionContent.title}
                  onChange={(e) => setSectionContent({...sectionContent, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Section title"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Subtitle/Description</label>
                <textarea
                  value={sectionContent.subtitle}
                  onChange={(e) => setSectionContent({...sectionContent, subtitle: e.target.value})}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Section description"
                />
              </div>

              {activeSection.id === 'footer' && (
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Footer Text</label>
                  <textarea
                    value={sectionContent.content}
                    onChange={(e) => setSectionContent({...sectionContent, content: e.target.value})}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Copyright text"
                  />
                </div>
              )}
            </div>

            {/* Bullet Points Editor */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Bullet Points</h3>
                <div className="text-sm text-gray-500">
                  {safeBullets.length} {safeBullets.length === 1 ? 'item' : 'items'}
                </div>
              </div>

              {/* Add New Bullet */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newBullet}
                  onChange={(e) => setNewBullet(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddBullet()}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                  placeholder="Add a new bullet point..."
                />
                <button
                  onClick={handleAddBullet}
                  className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {/* Bullets List - USING safeBullets instead of bullets */}
              <div className="space-y-3">
                {safeBullets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <List className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No bullet points yet. Add some above.</p>
                  </div>
                ) : (
                  safeBullets.map((bullet, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <button
                        onClick={() => handleToggleCheck(index)}
                        className="mt-1 flex-shrink-0"
                      >
                        {bullet.checked ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <input
                          type="text"
                          value={bullet.text || ''}
                          onChange={(e) => {
                            const newBullets = [...bullets];
                            if (newBullets[index]) {
                              newBullets[index].text = e.target.value;
                              setBullets(newBullets);
                            }
                          }}
                          className="w-full p-2 border-b border-transparent hover:border-gray-300 focus:border-emerald-500 focus:outline-none bg-transparent"
                        />
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveBullet(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveBullet(index, 'down')}
                          disabled={index === safeBullets.length - 1}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveBullet(index)}
                          className="p-2 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 font-medium"
              >
                {saving ? 'Saving...' : 'Save Section Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionBulletEditor;