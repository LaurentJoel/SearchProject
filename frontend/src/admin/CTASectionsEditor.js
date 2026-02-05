// src/admin/CTASectionsEditor.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, 
    Edit,
    Save,
    X,
    Plus,
    Trash2,
    AlertCircle,
    CheckCircle,
    Loader2,
    ArrowLeft,
    Type,
    MessageSquare,
    Calendar
} from 'lucide-react';
import { contentAPI } from '../services/api';

const CTASectionsEditor = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingSection, setEditingSection] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        content: '',
        button_text: '',
        button_link: '',
        icon: '',
        display_order: 0,
        is_active: true
    });

    const fetchSections = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await contentAPI.getDynamicSections('cta');
            const data = response.data;
            const sectionsArray = Array.isArray(data) ? data : [];
            
            setSections(sectionsArray);
        } catch (err) {
            console.error('Error fetching CTA sections:', err);
            setError('Failed to load CTA sections. Please try again.');
            setSections([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const handleEdit = (section) => {
        setEditingSection(section.id);
        setFormData({
            title: section.title || '',
            subtitle: section.subtitle || '',
            description: section.description || '',
            content: section.content || '',
            button_text: section.button_text || '',
            button_link: section.button_link || '',
            icon: section.icon || '',
            display_order: section.display_order || 0,
            is_active: section.is_active !== undefined ? section.is_active : true
        });
    };

    const handleCancelEdit = () => {
        setEditingSection(null);
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            content: '',
            button_text: '',
            button_link: '',
            icon: '',
            display_order: 0,
            is_active: true
        });
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
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('adminToken');
            
            if (editingSection) {
                // Update existing section
                await contentAPI.updateDynamicSection(editingSection, {
                    ...formData,
                    section_type: 'cta'
                });
                setSuccess('CTA section updated successfully!');
            } else {
                // Create new section
                await contentAPI.createDynamicSection({
                    ...formData,
                    section_type: 'cta'
                });
                setSuccess('CTA section created successfully!');
            }

            // Refresh sections list
            await fetchSections();
            handleCancelEdit();
            
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error saving CTA section:', err);
            setError('Failed to save CTA section. Please check your authentication and try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this CTA section?')) {
            return;
        }

        try {
            await contentAPI.deleteDynamicSection(id);
            
            setSuccess('CTA section deleted successfully!');
            fetchSections();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting CTA section:', err);
            setError('Failed to delete CTA section. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-green-600 font-medium">Loading CTA Sections</p>
                    <p className="text-gray-500 text-sm mt-2">Fetching sections data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">CTA Sections Editor</h1>
                    <p className="text-gray-600 mt-1">Manage call-to-action sections</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        to="/admin"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-red-800">Error</p>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-green-800">Success</p>
                            <p className="text-green-600 text-sm mt-1">{success}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Form for Add/Edit */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    {editingSection ? (
                        <>
                            <Edit className="h-5 w-5 text-green-600" />
                            Edit CTA Section
                        </>
                    ) : (
                        <>
                            <Plus className="h-5 w-5 text-green-600" />
                            Add New CTA Section
                        </>
                    )}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Type className="h-4 w-4" />
                                    Title *
                                </div>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="Enter CTA section title"
                            />
                        </div>

                        {/* Subtitle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Subtitle
                                </div>
                            </label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="Enter subtitle"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Description
                                </div>
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="Enter brief description"
                            />
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Content
                                </div>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="Enter detailed content"
                            />
                        </div>

                        {/* Button Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Text
                            </label>
                            <input
                                type="text"
                                name="button_text"
                                value={formData.button_text}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="e.g., Get Started"
                            />
                        </div>

                        {/* Button Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Link
                            </label>
                            <input
                                type="text"
                                name="button_link"
                                value={formData.button_link}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="e.g., /signup or https://..."
                            />
                        </div>

                        {/* Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Icon
                            </label>
                            <input
                                type="text"
                                name="icon"
                                value={formData.icon}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="e.g., 📢"
                            />
                        </div>

                        {/* Display Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                name="display_order"
                                value={formData.display_order}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="Order for display"
                            />
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center md:col-span-2">
                            <input
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                Active (visible on website)
                            </label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                        {editingSection && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {editingSection ? 'Update Section' : 'Add Section'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Sections List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-cyan-600" />
                        Existing CTA Sections
                        <span className="ml-2 text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                            {sections.length} sections
                        </span>
                    </h2>
                </div>

                {sections.length > 0 ? (
                    <div className="space-y-4">
                        {sections.map((section) => (
                            <div 
                                key={section.id} 
                                className={`border rounded-lg p-4 transition-colors ${
                                    editingSection === section.id
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyan-100">
                                                <span className="text-lg">{section.icon || '📢'}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{section.title}</h3>
                                                {section.subtitle && <p className="text-sm text-gray-600">{section.subtitle}</p>}
                                            </div>
                                        </div>
                                        
                                        {section.description && (
                                            <p className="text-gray-700 text-sm mb-2">
                                                {section.description}
                                            </p>
                                        )}

                                        {section.content && (
                                            <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                                                {section.content}
                                            </p>
                                        )}
                                        
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Order: {section.display_order || 0}</span>
                                            {section.button_text && <span>Button: {section.button_text}</span>}
                                            <span className={`px-2 py-1 rounded-full ${
                                                section.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {section.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(section)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(section.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No CTA sections found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Add your first CTA section using the form above
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CTASectionsEditor;