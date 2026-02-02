// src/admin/Dashboard.js - FIXED (NO AUTO-REFRESH, NO INTERVALS)
import React, { useState, useEffect, useRef } from 'react';
import { 
    FileText, Edit, Eye, RefreshCw, Clock, Activity,
    Settings, AlertCircle, CheckCircle, XCircle, Loader2,
    Video, ListChecks, Target, MessageCircle
} from 'lucide-react';
import { healthAPI } from '../services/api';
import { useContent } from '../context/ContentContext';

const Dashboard = () => {
    const { backendConnected: contextBackendStatus, refreshContent } = useContent();
    
    const [contentStats, setContentStats] = useState({
        totalSections: 0,
        totalFeatures: 0,
        lastUpdated: null
    });
    
    const [systemHealth, setSystemHealth] = useState({ 
        status: 'checking', 
        database: 'Checking...',
        message: ''
    });
    
    const [backendConnected, setBackendConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const hasFetchedInitial = useRef(false);

    const fetchDashboardData = async () => {
        setRefreshing(true);
        setError(null);
        
        try {
            console.log('📊 [Dashboard] Checking backend health...');
            const healthResponse = await healthAPI.check();
            const healthData = healthResponse.data;
            
            console.log('✅ [Dashboard] Backend is online');
            setBackendConnected(true);
            setSystemHealth({
                status: 'healthy',
                database: healthData.database || 'Connected',
                message: healthData.message || 'All systems operational'
            });
            
            setContentStats({
                totalSections: healthData.content_sections || 0,
                totalFeatures: healthData.features || 0,
                lastUpdated: new Date()
            });

        } catch (error) {
            console.error('❌ [Dashboard] Backend is offline:', error);
            setBackendConnected(false);
            setSystemHealth({ 
                status: 'error', 
                database: 'Disconnected',
                message: 'Backend server is not running'
            });
            setError('Backend server is offline. Start it with: python app.py');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fetch ONCE on mount - NO INTERVALS
    useEffect(() => {
        if (hasFetchedInitial.current) return;
        hasFetchedInitial.current = true;
        
        console.log('🎯 [Dashboard] Initial health check (ONE TIME ONLY)...');
        fetchDashboardData();
        
        // Cleanup function
        return () => {
            console.log('🧹 [Dashboard] Cleaning up');
        };
    }, []);

    const handleManualRefresh = async () => {
        console.log('🔄 [Dashboard] Manual refresh requested');
        
        // Check backend health first
        await fetchDashboardData();
        
        // Only refresh content if backend is online
        if (backendConnected) {
            console.log('🔄 [Dashboard] Backend online, refreshing content...');
            if (refreshContent) {
                refreshContent();
            }
            window.dispatchEvent(new Event('content-refresh'));
            window.postMessage({ type: 'REFRESH_CONTENT' }, '*');
        } else {
            console.warn('⚠️ [Dashboard] Backend offline, skipping content refresh');
        }
    };

    const quickActions = [
        { 
            title: 'Edit Hero Section', 
            description: 'Update main banner', 
            icon: <Edit className="h-5 w-5" />, 
            path: '/admin/content',
            color: 'border-green-200 hover:border-green-300 hover:bg-green-50'
        },
        { 
            title: 'Manage Features', 
            description: 'Add or edit features', 
            icon: <ListChecks className="h-5 w-5" />, 
            path: '/admin/features',
            color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'
        },
        { 
            title: 'Vision Sections', 
            description: 'Future features', 
            icon: <Target className="h-5 w-5" />, 
            path: '/admin/vision',
            color: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50'
        },
        { 
            title: 'Video Demo', 
            description: 'Update video', 
            icon: <Video className="h-5 w-5" />, 
            path: '/admin/content',
            color: 'border-orange-200 hover:border-orange-300 hover:bg-orange-50'
        },
        { 
            title: 'CTA Sections', 
            description: 'Call-to-action', 
            icon: <MessageCircle className="h-5 w-5" />, 
            path: '/admin/cta',
            color: 'border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50'
        },
        { 
            title: 'Preview Website', 
            description: 'View live site', 
            icon: <Eye className="h-5 w-5" />, 
            path: '/',
            target: '_blank',
            color: 'border-red-200 hover:border-red-300 hover:bg-red-50'
        },
    ];

    const formatDate = (date) => {
        if (!date) return 'Never';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-green-600 font-medium">Checking Backend Status</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Content Management Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your website content and monitor system status</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                        backendConnected 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {backendConnected ? 'Backend Online' : 'Backend Offline'}
                    </div>
                    <button
                        onClick={handleManualRefresh}
                        disabled={refreshing}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Checking...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                            <p className="font-medium text-red-800">Backend Offline</p>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                            <p className="text-red-600 text-xs mt-2">Run: <code className="bg-red-100 px-2 py-0.5 rounded">cd backend && python app.py</code></p>
                        </div>
                    </div>
                </div>
            )}

            {backendConnected && !error && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                            <p className="font-medium text-green-800">Backend Online</p>
                            <p className="text-green-600 text-sm mt-1">
                                {systemHealth.message} • Database: {systemHealth.database} • 
                                {contentStats.totalSections} sections, {contentStats.totalFeatures} features
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Content Sections</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {contentStats.totalSections}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Total sections</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl text-white">
                            <FileText className="h-6 w-6" />
                        </div>
                    </div>
                    <a
                        href="/admin/content"
                        className="block text-center p-2 text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                        View all sections →
                    </a>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">System Status</p>
                            <div className="flex items-center mt-2">
                                {backendConnected ? (
                                    <>
                                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                        <p className="text-lg font-bold text-green-600">Online</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                        <p className="text-lg font-bold text-red-600">Offline</p>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Static - No auto-refresh</p>
                        </div>
                        <div className={`p-3 rounded-xl ${
                            backendConnected 
                                ? 'bg-gradient-to-br from-green-400 to-green-500' 
                                : 'bg-gradient-to-br from-red-400 to-red-500'
                        } text-white`}>
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="text-gray-500 text-sm">
                        {getCurrentTime()}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Last Updated</p>
                            <p className="text-lg font-bold text-gray-800 mt-2">
                                {formatDate(contentStats.lastUpdated)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Manual refresh only
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-3 rounded-xl text-white">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-green-600" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                        <a
                            key={index}
                            href={action.path}
                            target={action.target || '_self'}
                            className={`p-4 border-2 border-dashed rounded-lg transition-all ${action.color} hover:shadow-sm`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-green-600">
                                    {action.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {action.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">{action.description}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {!backendConnected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                        <div>
                            <p className="font-medium text-yellow-800">Backend Not Running</p>
                            <p className="text-yellow-700 text-sm mt-1">
                                Start the backend server to enable editing:
                            </p>
                            <pre className="bg-yellow-100 text-yellow-900 px-3 py-2 rounded mt-2 text-xs">
cd backend{'\n'}python app.py
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;