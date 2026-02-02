// src/admin/FeaturesEditor.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit, X, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { contentAPI } from '../services/api';

const FeaturesEditor = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    icon: '✨',
    order: 0,
    is_active: true
  });

  const icons = ['✨', '⚡', '🔒', '🌍', '💡', '📱', '🎯', '🚀', '🔧', '🌟'];

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contentAPI.getFeatures();
      
      if (Array.isArray(response.data)) {
        const sortedFeatures = response.data.sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order;
          return a.id - b.id;
        });
        setFeatures(sortedFeatures);
      } else {
        setFeatures([]);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      setError('Failed to load features.');
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFeature = async (featureId) => {
    if (!editingData[featureId]) return;
    
    setSaving(true);
    try {
      const updatedData = {
        title: editingData[featureId].title || '',
        description: editingData[featureId].description || '',
        icon: editingData[featureId].icon || '✨',
        order: parseInt(editingData[featureId].order) || 0,
        is_active: editingData[featureId].is_active !== undefined ? editingData[featureId].is_active : true
      };

      await contentAPI.updateFeature(featureId, updatedData);
      
      setMessage('✅ Feature updated successfully!');
      setEditingId(null);
      setEditingData({});
      fetchFeatures();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating feature:', error);
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = async () => {
    if (!newFeature.title.trim() || !newFeature.description.trim()) {
      setMessage('❌ Title and description are required');
      return;
    }

    setSaving(true);
    setMessage('');
    
    try {
      const featureData = {
        title: newFeature.title.trim(),
        description: newFeature.description.trim(),
        icon: newFeature.icon,
        order: parseInt(newFeature.order) || features.length,
        is_active: newFeature.is_active
      };

      await contentAPI.createFeature(featureData);
      
      setMessage('✅ Feature added successfully!');
      
      setNewFeature({
        title: '',
        description: '',
        icon: '✨',
        order: features.length,
        is_active: true
      });
      
      fetchFeatures();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding feature:', error);
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFeature = async (featureId) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) {
      return;
    }

    try {
      await contentAPI.deleteFeature(featureId);
      setMessage('✅ Feature deleted successfully!');
      
      fetchFeatures();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting feature:', error);
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (feature) => {
    setEditingId(feature.id);
    setEditingData({
      [feature.id]: {
        title: feature.title,
        description: feature.description,
        icon: feature.icon || '✨',
        order: feature.order || 0,
        is_active: feature.is_active !== undefined ? feature.is_active : true
      }
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleEditChange = (featureId, field, value) => {
    setEditingData(prev => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        [field]: field === 'order' ? parseInt(value) || 0 : 
                 field === 'is_active' ? value === 'true' || value === true :
                 value
      }
    }));
  };

  const handleNewFeatureChange = (field, value) => {
    setNewFeature(prev => ({
      ...prev,
      [field]: field === 'order' ? parseInt(value) || 0 : 
               field === 'is_active' ? value === 'true' || value === true :
               value
    }));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Features Editor</h1>
          <p className="text-gray-600 mt-2">Manage your website features</p>
        </div>
        <button
          onClick={fetchFeatures}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition mt-4 md:mt-0 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Features'}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.includes('✅') ? (
            <Check className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Connection Issue:</span>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Add New Feature Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-emerald-600" />
          Add New Feature
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Title *</label>
            <input
              type="text"
              value={newFeature.title}
              onChange={(e) => handleNewFeatureChange('title', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Lightning Fast Search"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Icon</label>
            <div className="flex items-center gap-3">
              <select
                value={newFeature.icon}
                onChange={(e) => handleNewFeatureChange('icon', e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {icons.map((icon, index) => (
                  <option key={index} value={icon}>
                    {icon} Icon
                  </option>
                ))}
              </select>
              <span className="text-2xl bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center">
                {newFeature.icon}
              </span>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2 text-sm font-medium">Description *</label>
            <textarea
              value={newFeature.description}
              onChange={(e) => handleNewFeatureChange('description', e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Describe this feature in detail..."
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Display Order</label>
            <input
              type="number"
              min="0"
              value={newFeature.order}
              onChange={(e) => handleNewFeatureChange('order', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>
          <div className="flex items-center h-full">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={newFeature.is_active}
                onChange={(e) => handleNewFeatureChange('is_active', e.target.checked)}
                className="sr-only"
              />
              <div className={`relative w-11 h-6 rounded-full transition-colors ${newFeature.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transform transition-transform ${newFeature.is_active ? 'translate-x-5' : ''}`}></div>
              </div>
              <span className="ml-3 text-gray-700 font-medium">Active</span>
            </label>
          </div>
        </div>
        <button
          onClick={handleAddFeature}
          disabled={saving || !newFeature.title.trim() || !newFeature.description.trim()}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition disabled:opacity-50 font-medium"
        >
          <Plus size={18} />
          {saving ? 'Adding Feature...' : 'Add New Feature'}
        </button>
      </div>

      {/* Features List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Current Features
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({features.length} total, {features.filter(f => f.is_active).length} active)
            </span>
          </h2>
          <div className="text-sm text-gray-500">
            Features appear on website in order
          </div>
        </div>
        
        {features.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No features yet</h3>
            <p className="text-gray-600 mb-4">Add your first feature using the form above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.id} className={`p-5 border rounded-xl transition-all ${feature.is_active ? 'border-emerald-100 bg-emerald-50/50' : 'border-gray-200 bg-gray-50/50'} hover:shadow-sm`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-3xl bg-white p-3 rounded-lg border">
                      {feature.icon || '✨'}
                    </div>
                    <div className="flex-1">
                      {editingId === feature.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-700 mb-1 text-sm font-medium">Title</label>
                              <input
                                type="text"
                                value={editingData[feature.id]?.title || ''}
                                onChange={(e) => handleEditChange(feature.id, 'title', e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 mb-1 text-sm font-medium">Icon</label>
                              <select
                                value={editingData[feature.id]?.icon || '✨'}
                                onChange={(e) => handleEditChange(feature.id, 'icon', e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                              >
                                {icons.map((icon, index) => (
                                  <option key={index} value={icon}>{icon}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-1 text-sm font-medium">Description</label>
                            <textarea
                              value={editingData[feature.id]?.description || ''}
                              onChange={(e) => handleEditChange(feature.id, 'description', e.target.value)}
                              rows="3"
                              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-gray-700 mb-1 text-sm font-medium">Order</label>
                              <input
                                type="number"
                                min="0"
                                value={editingData[feature.id]?.order || 0}
                                onChange={(e) => handleEditChange(feature.id, 'order', e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingData[feature.id]?.is_active !== undefined ? editingData[feature.id].is_active : true}
                                  onChange={(e) => handleEditChange(feature.id, 'is_active', e.target.checked)}
                                  className="sr-only"
                                />
                                <div className={`relative w-11 h-6 rounded-full transition-colors ${editingData[feature.id]?.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transform transition-transform ${editingData[feature.id]?.is_active ? 'translate-x-5' : ''}`}></div>
                                </div>
                                <span className="ml-3 text-gray-700">Active</span>
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveFeature(feature.id)}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                              >
                                <Save size={14} />
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                              >
                                <X size={14} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${feature.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                              {feature.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              Order: {feature.order || 0}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{feature.description}</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {editingId !== feature.id && (
                    <div className="flex gap-1 ml-4">
                      <button
                        onClick={() => handleEdit(feature)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit feature"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete feature"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturesEditor;