// src/admin/DynamicSectionsEditor.js - For Platform/Future/CTA sections
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, Image as ImageIcon, 
  Video, Type, Heading, Upload, ArrowUp, ArrowDown 
} from 'lucide-react';
import { contentAPI } from '../services/api';

const DynamicSectionsEditor = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Default to 'platform' for this editor
  const sectionType = 'platform';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    icon: '🚀',
    image_url: '',
    video_url: '',
    display_order: 0,
    is_active: true,
    section_type: sectionType
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      console.log(`Fetching ${sectionType} sections...`);
      
      const response = await contentAPI.getDynamicSections(sectionType);
      console.log(`${sectionType} sections response:`, response);
      
      if (response && response.data) {
        setSections(response.data);
        setError('');
      } else {
        setSections([]);
        setError('No data received from server');
      }
    } catch (err) {
      console.error(`Failed to fetch ${sectionType} sections:`, err);
      setError(`Failed to load ${sectionType} sections`);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await contentAPI.updateDynamicSection(editingId, formData);
      } else {
        await contentAPI.createDynamicSection(formData);
      }
      
      resetForm();
      fetchSections();
    } catch (err) {
      console.error('Error saving section:', err);
      setError('Failed to save section: ' + (err.message || 'Unknown error'));
    }
  };

  const handleEdit = (section) => {
    setFormData({
      title: section.title || '',
      description: section.description || '',
      content: section.content || '',
      icon: section.icon || '🚀',
      image_url: section.image_url || '',
      video_url: section.video_url || '',
      display_order: section.display_order || 0,
      is_active: section.is_active !== false,
      section_type: sectionType
    });
    setEditingId(section.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await contentAPI.deleteDynamicSection(id);
        fetchSections();
      } catch (err) {
        console.error('Error deleting section:', err);
        setError('Failed to delete section');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      icon: '🚀',
      image_url: '',
      video_url: '',
      display_order: sections.length,
      is_active: true,
      section_type: sectionType
    });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const section = sections.find(s => s.id === id);
      if (!section) return;
      
      await contentAPI.updateDynamicSection(id, {
        ...section,
        is_active: !currentStatus,
        section_type: sectionType
      });
      fetchSections();
    } catch (err) {
      console.error('Error toggling active status:', err);
      setError('Failed to update status');
    }
  };

  const moveOrder = async (id, direction) => {
    const section = sections.find(s => s.id === id);
    if (!section) return;
    
    const newOrder = direction === 'up' ? section.display_order - 1 : section.display_order + 1;
    const swapSection = sections.find(s => s.display_order === newOrder);
    
    if (swapSection) {
      try {
        // Update current section
        await contentAPI.updateDynamicSection(id, { 
          ...section, 
          display_order: newOrder 
        });
        // Update swap section
        await contentAPI.updateDynamicSection(swapSection.id, { 
          ...swapSection, 
          display_order: section.display_order 
        });
        fetchSections();
      } catch (err) {
        console.error('Error updating order:', err);
        setError('Failed to update order');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dynamic Content Editor</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dynamic Content Editor</h1>
        {!showForm && sections.length === 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Create First Section</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Section' : 'Create New Section'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter section title"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Brief description..."
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Detailed content..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Icon</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="🚀"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Video URL</label>
                <input
                  type="text"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-5 w-5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <label className="text-gray-700 font-medium">Active</label>
                <p className="text-sm text-gray-500">Visible on website</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium"
              >
                {editingId ? 'Update Section' : 'Create Section'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Sections ({sections.length})</h2>
            {sections.length > 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2"
              >
                <Plus size={18} />
                <span>Add New Section</span>
              </button>
            )}
          </div>
          
          {sections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <p className="text-lg">No sections yet.</p>
              <p className="text-sm mt-2">Create your first section.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 inline-flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Create First Section</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {sections
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((section) => (
                  <div key={section.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => moveOrder(section.id, 'up')} 
                          disabled={section.display_order === 0}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ArrowUp className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                        <button 
                          onClick={() => moveOrder(section.id, 'down')} 
                          disabled={section.display_order >= sections.length - 1}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ArrowDown className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                        <span className="text-xl">{section.icon || '🚀'}</span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800">{section.title}</h3>
                        <p className="text-sm text-gray-600 truncate max-w-md">{section.description || section.content}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${section.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {section.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs text-gray-500">Order: {section.display_order || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(section)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => toggleActive(section.id, section.is_active)}
                        className={`p-2 rounded-lg ${section.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={section.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {section.is_active ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicSectionsEditor;